/**
 * Three.js presentation layer.
 *
 * The renderer never owns gameplay state: it reads the CombatSim snapshot and
 * entity arrays, and writes transforms. Ships, enemies, bosses, projectiles and
 * debris are real 3D geometry with pooled meshes and instanced particles.
 */
import * as THREE from 'three'
import { FIELD, QUALITY, type QualityId } from '../core/constants'
import { frameField } from '../core/framing'
import type { CombatSim, SimEvent } from '../sim/combat'
import type { SectorSpec } from '../content/sectors'
import { shipById } from '../content/ships'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  maxLife: number
  size: number
  color: THREE.Color
}

const TAU = Math.PI * 2

function glowMaterial(color: THREE.ColorRepresentation, emissive = 1.15, metalness = 0.2): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: emissive,
    metalness,
    roughness: 0.5,
  })
}

/** Flat, saturated toy-plastic shading: cartoon, not chrome. */
function hullMaterial(color: THREE.ColorRepresentation, accent: THREE.ColorRepresentation): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(accent),
    emissiveIntensity: 0.45,
    metalness: 0.25,
    roughness: 0.55,
  })
}

const OUTLINE_COLOR = '#080d1e'

/**
 * Inverted-hull outlines around every solid part. This is what gives the
 * models their drawn, chunky arcade-cartoon silhouette; transparent shells
 * (shields, flames, bubbles) are left alone so glows stay soft.
 */
function addToonOutline(group: THREE.Group, thickness = 1.1): void {
  const outline = new THREE.MeshBasicMaterial({ color: OUTLINE_COLOR, side: THREE.BackSide })
  const solids = group.children.filter((child) => {
    const mesh = child as THREE.Mesh
    if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return false
    const material = mesh.material as THREE.Material | undefined
    return Boolean(material) && !material!.transparent
  })
  for (const child of solids) {
    const mesh = child as THREE.Mesh
    const shell = new THREE.Mesh(mesh.geometry, outline)
    shell.position.copy(mesh.position)
    shell.rotation.copy(mesh.rotation)
    shell.scale.copy(mesh.scale).multiplyScalar(thickness)
    shell.renderOrder = -1
    group.add(shell)
  }
}

export class SceneRenderer {
  private readonly canvas: HTMLCanvasElement
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera: THREE.OrthographicCamera
  private readonly world = new THREE.Group()
  private readonly menuGroup = new THREE.Group()
  private readonly stars: THREE.Points[] = []
  private readonly particles: Particle[] = []
  private readonly particleMesh: THREE.InstancedMesh
  private readonly friendlyBullets: THREE.InstancedMesh
  private readonly hostileBullets: THREE.InstancedMesh
  private readonly pickups: THREE.InstancedMesh
  private readonly dummy = new THREE.Matrix4()
  private readonly tempColor = new THREE.Color()

  private nebula: THREE.Mesh
  private planet: THREE.Mesh
  private glow: THREE.PointLight
  private hero: THREE.Group | null = null
  private playerMesh: THREE.Group | null = null
  private bossMesh: THREE.Group | null = null
  private stationMesh: THREE.Group | null = null
  private droneMeshes: THREE.Group[] = []
  private beamPool: THREE.Mesh[] = []
  private enemyMeshes = new Map<number, THREE.Group>()
  private enemyPool = new Map<string, THREE.Group[]>()
  private asteroidMeshes: THREE.Mesh[] = []
  private quality: QualityId = 'high'
  private viewHalfWidth = FIELD.halfWidth * 1.08
  private viewHalfHeight = FIELD.halfHeight
  private viewCenterX = 0
  private viewCenterY = FIELD.halfHeight
  private shake = 0
  private menuTime = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setClearColor('#04060f', 1)
    this.camera = new THREE.OrthographicCamera(-50, 50, 89, -89, 0.1, 400)
    this.camera.position.set(0, FIELD.height / 2, 160)
    this.camera.lookAt(0, FIELD.height / 2, 0)
    this.scene.add(this.camera)
    this.scene.add(this.world)
    this.scene.add(this.menuGroup)
    this.world.visible = false

    this.scene.add(new THREE.AmbientLight('#93a9ff', 1.0))
    const key = new THREE.DirectionalLight('#ffffff', 1.7)
    key.position.set(-40, 130, 90)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight('#7dd3fc', 1.05)
    rim.position.set(50, 30, 40)
    this.scene.add(rim)
    this.glow = new THREE.PointLight('#4de1ff', 22, 90, 2)
    this.glow.position.set(0, 40, 30)
    this.scene.add(this.glow)

    this.nebula = this.buildNebula()
    this.scene.add(this.nebula)
    this.planet = new THREE.Mesh(
      new THREE.SphereGeometry(26, 32, 24),
      new THREE.MeshStandardMaterial({ color: '#3b6ea8', emissive: '#1b3a5f', emissiveIntensity: 0.6, roughness: 0.8 }),
    )
    this.planet.position.set(-30, 210, -80)
    this.scene.add(this.planet)

    this.buildStars()

    this.particleMesh = this.instanced(new THREE.TetrahedronGeometry(0.75, 0), glowMaterial('#ffffff', 1.4), 900)
    this.friendlyBullets = this.instanced(new THREE.CapsuleGeometry(0.55, 1.6, 3, 6), glowMaterial('#ffffff', 1.7), 260)
    this.hostileBullets = this.instanced(new THREE.SphereGeometry(0.95, 8, 6), glowMaterial('#ffffff', 1.6), 300)
    this.pickups = this.instanced(new THREE.OctahedronGeometry(1.5, 0), glowMaterial('#ffffff', 1.8), 32)

    for (let index = 0; index < 8; index += 1) {
      const beam = new THREE.Mesh(
        new THREE.PlaneGeometry(1, FIELD.height),
        new THREE.MeshBasicMaterial({ color: '#fca5a5', transparent: true, opacity: 0.75, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
      )
      beam.visible = false
      this.world.add(beam)
      this.beamPool.push(beam)
    }

    this.setQuality('high')
    this.resize()
  }

  // -------------------------------------------------------------------- setup

  private instanced(geometry: THREE.BufferGeometry, material: THREE.Material, capacity: number): THREE.InstancedMesh {
    const mesh = new THREE.InstancedMesh(geometry, material, capacity)
    mesh.frustumCulled = false
    mesh.count = capacity
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.dummy.makeScale(0, 0, 0)
    for (let index = 0; index < capacity; index += 1) mesh.setMatrixAt(index, this.dummy)
    this.scene.add(mesh)
    return mesh
  }

  private buildNebula(): THREE.Mesh {
    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#2b3d8f') },
        uColorB: { value: new THREE.Color('#7c3f8c') },
        uSky: { value: new THREE.Color('#05091a') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uSky;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float total = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            total += noise(p) * amp;
            p *= 2.03;
            amp *= 0.5;
          }
          return total;
        }
        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.015;
          float clouds = fbm(uv * 3.2 + vec2(t, -t * 0.6));
          float wisps = fbm(uv * 7.0 - vec2(t * 0.8, t));
          float density = smoothstep(0.35, 1.05, clouds + wisps * 0.35);
          vec3 color = uSky;
          color = mix(color, uColorA, density * 0.85);
          color = mix(color, uColorB, smoothstep(0.4, 0.95, wisps) * 0.55);
          float stars = step(0.9992, hash(floor(uv * 520.0)));
          color += vec3(stars) * 0.9;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(560, 460), material)
    mesh.position.set(0, 90, -160)
    return mesh
  }

  private buildStars(): void {
    const layers = [
      { count: 700, size: 0.55, z: -40, speed: 3.2, opacity: 0.9 },
      { count: 420, size: 0.9, z: -80, speed: 6.5, opacity: 0.75 },
      { count: 220, size: 1.4, z: -120, speed: 11, opacity: 0.55 },
    ]
    for (const layer of layers) {
      const positions = new Float32Array(layer.count * 3)
      for (let index = 0; index < layer.count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 300
        positions[index * 3 + 1] = (Math.random() - 0.5) * 320
        positions[index * 3 + 2] = layer.z + (Math.random() - 0.5) * 40
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const material = new THREE.PointsMaterial({
        color: '#e2f2ff',
        size: layer.size,
        transparent: true,
        opacity: layer.opacity,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const points = new THREE.Points(geometry, material)
      points.userData.speed = layer.speed
      this.scene.add(points)
      this.stars.push(points)
    }
  }

  setQuality(quality: QualityId): void {
    this.quality = quality
    const preset = QUALITY[quality]
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.pixelRatio))
    for (const [index, layer] of this.stars.entries()) {
      const wanted = Math.round(preset.stars * (index === 0 ? 0.62 : index === 1 ? 0.28 : 0.1))
      const attribute = layer.geometry.getAttribute('position') as THREE.BufferAttribute
      layer.geometry.setDrawRange(0, Math.min(wanted, attribute.count))
    }
    this.resize()
  }

  setSector(sector: SectorSpec): void {
    const material = this.nebula.material as THREE.ShaderMaterial
    material.uniforms.uColorA!.value = new THREE.Color(sector.palette.nebula)
    material.uniforms.uColorB!.value = new THREE.Color(sector.palette.nebula2)
    material.uniforms.uSky!.value = new THREE.Color(sector.palette.sky)
    this.renderer.setClearColor(sector.palette.sky, 1)
    ;(this.planet.material as THREE.MeshStandardMaterial).color = new THREE.Color(sector.palette.planet)
    ;(this.planet.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(sector.palette.accent).multiplyScalar(0.22)
    this.planet.position.set(-34, 252, -80)
    this.glow.color = new THREE.Color(sector.palette.accent)
    this.scene.fog = new THREE.Fog(new THREE.Color(sector.palette.fog), 200, 340)
  }

  setShip(shipId: string): void {
    const ship = shipById(shipId)
    if (this.playerMesh) this.world.remove(this.playerMesh)
    this.playerMesh = buildShip(ship.shape, ship.hullColor, ship.accentColor)
    // The fighters read as tiny specks at the old scale on a phone screen.
    this.playerMesh.scale.setScalar(1.7)
    this.world.add(this.playerMesh)
    if (this.hero) this.menuGroup.remove(this.hero)
    this.hero = buildShip(ship.shape, ship.hullColor, ship.accentColor)
    this.hero.scale.setScalar(1.35)
    this.menuGroup.add(this.hero)
  }

  resize(): void {
    // The canvas is what the player actually sees, and inside the arcade it is
    // narrower than the window (portrait column on desktop), so measure it
    // rather than the window.
    const width = Math.max(1, this.canvas.clientWidth || window.innerWidth)
    const height = Math.max(1, this.canvas.clientHeight || window.innerHeight)
    this.renderer.setSize(width, height, false)

    const frame = frameField(width, height)
    this.viewHalfWidth = frame.halfWidth
    this.viewHalfHeight = frame.halfHeight
    this.viewCenterX = frame.centerX
    this.viewCenterY = frame.centerY
    // An orthographic frustum is expressed in view space, relative to the
    // camera's own position — not in world coordinates. Keeping the camera on
    // the arena centre and the frustum symmetric around it is the only way the
    // projected field lands where frameField says it does.
    this.camera.position.set(frame.centerX, frame.centerY, 160)
    this.camera.lookAt(frame.centerX, frame.centerY, 0)
    this.camera.left = -frame.halfWidth
    this.camera.right = frame.halfWidth
    this.camera.top = frame.halfHeight
    this.camera.bottom = -frame.halfHeight
    this.camera.updateProjectionMatrix()
  }

  /** Live camera geometry, for the debug API and layout checks. */
  frameInfo(): Record<string, unknown> {
    return {
      canvasW: this.canvas.clientWidth,
      canvasH: this.canvas.clientHeight,
      bufferW: this.canvas.width,
      bufferH: this.canvas.height,
      // World-space bounds, which is what layout checks care about.
      left: this.viewCenterX - this.viewHalfWidth,
      right: this.viewCenterX + this.viewHalfWidth,
      top: this.viewCenterY + this.viewHalfHeight,
      bottom: this.viewCenterY - this.viewHalfHeight,
      camX: this.camera.position.x,
      camY: this.camera.position.y,
      camZ: this.camera.position.z,
      zoom: this.camera.zoom,
      viewHalfW: this.viewHalfWidth,
      viewHalfH: this.viewHalfHeight,
      viewCenterY: this.viewCenterY,
      player: this.playerMesh
        ? { x: this.playerMesh.position.x, y: this.playerMesh.position.y, visible: this.playerMesh.visible }
        : null,
    }
  }

  /** Screen pixels → logical field coordinates, using the live camera framing. */
  screenToWorld(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect()
    const px = (clientX - rect.left) / Math.max(1, rect.width)
    const py = (clientY - rect.top) / Math.max(1, rect.height)
    return {
      x: this.viewCenterX + (px - 0.5) * 2 * this.viewHalfWidth,
      y: this.viewCenterY + (0.5 - py) * 2 * this.viewHalfHeight,
    }
  }

  showMenu(): void {
    this.world.visible = false
    this.menuGroup.visible = true
    this.scene.fog = null
    if (this.simulation) this.simulation = null
  }

  showGame(sim: CombatSim): void {
    this.simulation = sim
    this.world.visible = true
    this.menuGroup.visible = false
    this.clearEnemyMeshes()
  }

  private simulation: CombatSim | null = null

  // --------------------------------------------------------------------- frame

  render(dt: number): void {
    const time = performance.now() / 1000
    const material = this.nebula.material as THREE.ShaderMaterial
    material.uniforms.uTime!.value = time
    this.planet.rotation.y += dt * 0.05
    for (const layer of this.stars) {
      const positions = layer.geometry.getAttribute('position') as THREE.BufferAttribute
      const array = positions.array as Float32Array
      const speed = Number(layer.userData.speed ?? 4) * (this.world.visible ? 1 : 0.3)
      for (let index = 1; index < array.length; index += 3) {
        array[index] = (array[index] as number) - speed * dt
        if ((array[index] as number) < -160) array[index] = 160
      }
      positions.needsUpdate = true
    }

    if (this.simulation && this.world.visible) {
      this.syncGame(this.simulation, dt)
    } else {
      this.menuTime += dt
      if (this.hero) {
        this.hero.position.set(0, 72 + Math.sin(this.menuTime * 0.8) * 2.2, 0)
        this.hero.rotation.y = Math.sin(this.menuTime * 0.5) * 0.7
        this.hero.rotation.z = Math.sin(this.menuTime * 0.9) * 0.08
      }
      this.menuGroup.position.x = Math.sin(this.menuTime * 0.25) * 3
      this.updateParticles(dt)
    }

    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 3.2)
      const amount = this.shake * 0.9
      this.camera.position.x = (Math.random() - 0.5) * amount
      this.camera.position.y = FIELD.height / 2 + (Math.random() - 0.5) * amount
    } else {
      this.camera.position.x += (this.viewCenterX - this.camera.position.x) * Math.min(1, dt * 8)
      this.camera.position.y += (this.viewCenterY - this.camera.position.y) * Math.min(1, dt * 8)
    }

    this.renderer.render(this.scene, this.camera)
  }

  consume(events: SimEvent[]): void {
    for (const event of events) {
      switch (event.type) {
        case 'explode':
          this.burst(event.x, event.y, event.size ?? 5, event.color ?? '#fbbf24')
          this.shake = Math.min(1.4, this.shake + (event.size ?? 4) * 0.02)
          break
        case 'hit':
          this.burst(event.x, event.y, 1.6, event.color ?? '#fef3c7', 4)
          break
        case 'death':
          this.burst(event.x, event.y, 14, '#fca5a5', 40)
          this.shake = Math.min(2, this.shake + 1.2)
          break
        case 'pickup':
          this.burst(event.x, event.y, 3, event.color ?? '#8ef0c8', 8)
          break
        case 'arc':
          if (event.x2 !== undefined && event.y2 !== undefined) {
            this.burst((event.x + event.x2) / 2, (event.y + event.y2) / 2, 3, '#c4b5fd', 6)
          }
          break
        case 'boss':
          this.shake = Math.min(2, this.shake + 0.8)
          break
        case 'phase':
          this.shake = Math.min(2, this.shake + 0.9)
          break
        case 'beam':
          this.burst(event.x, event.y, 3, event.color ?? '#fca5a5', 5)
          break
        default:
          break
      }
    }
  }

  private syncGame(sim: CombatSim, dt: number): void {
    if (this.playerMesh) {
      this.playerMesh.position.set(sim.player.x, sim.player.y, 0)
      this.playerMesh.rotation.z = THREE.MathUtils.clamp(-sim.player.vx * 0.02, -0.45, 0.45)
      this.playerMesh.rotation.x = THREE.MathUtils.clamp(sim.player.vy * 0.004, -0.25, 0.25)
      const flicker = sim.player.invuln > 0 && Math.floor(performance.now() / 90) % 2 === 0
      this.playerMesh.visible = !flicker || sim.player.invuln > 0.9
      const shield = this.playerMesh.getObjectByName('shield')
      if (shield) {
        shield.visible = sim.player.shield > 0
        const scale = 1 + Math.sin(performance.now() / 300) * 0.04
        shield.scale.setScalar(scale)
      }
    }
    this.glow.position.set(sim.player.x, sim.player.y + 4, 24)

    this.syncEnemies(sim)
    this.syncBoss(sim)
    this.syncBullets(sim)
    this.syncPickups(sim)
    this.syncBeams(sim)
    this.syncStation(sim)
    this.syncDrones(sim)
    this.syncAsteroids(sim)
    this.updateParticles(dt)
  }

  private clearEnemyMeshes(): void {
    for (const mesh of this.enemyMeshes.values()) {
      this.world.remove(mesh)
      const key = String(mesh.userData.poolKey ?? '')
      if (key) {
        const pool = this.enemyPool.get(key) ?? []
        pool.push(mesh)
        this.enemyPool.set(key, pool)
      }
    }
    this.enemyMeshes.clear()
  }

  private syncEnemies(sim: CombatSim): void {
    const seen = new Set<number>()
    for (const enemy of sim.enemies) {
      seen.add(enemy.id)
      let mesh = this.enemyMeshes.get(enemy.id)
      if (!mesh) {
        mesh = this.acquireEnemyMesh(enemy.spec)
        this.enemyMeshes.set(enemy.id, mesh)
      }
      mesh.position.set(enemy.x, enemy.y, 0)
      mesh.rotation.z = Math.sin(sim.time * 1.4 + enemy.path) * 0.2
      const scale = (enemy.flash > 0 ? 1 + enemy.flash * 0.16 : 1) * 1.5
      mesh.scale.setScalar(scale)
      for (const child of mesh.children) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
        if (material && 'emissiveIntensity' in material) {
          material.emissiveIntensity = enemy.flash > 0 ? 2.2 : enemy.shielded > 0 ? 1.1 : 0.3
        }
      }
    }
    for (const [id, mesh] of this.enemyMeshes) {
      if (seen.has(id)) continue
      this.world.remove(mesh)
      const key = String(mesh.userData.poolKey ?? '')
      const pool = this.enemyPool.get(key) ?? []
      pool.push(mesh)
      this.enemyPool.set(key, pool)
      this.enemyMeshes.delete(id)
    }
  }

  private acquireEnemyMesh(spec: { id: string; shape: string; color: string; accent: string; behavior: string }): THREE.Group {
    const key = `${spec.shape}:${spec.color}:${spec.accent}`
    const pool = this.enemyPool.get(key)
    const existing = pool?.pop()
    if (existing) {
      existing.visible = true
      this.world.add(existing)
      return existing
    }
    const mesh = buildEnemy(spec.shape, spec.color, spec.accent, spec.behavior)
    mesh.userData.poolKey = key
    this.world.add(mesh)
    return mesh
  }

  private syncBoss(sim: CombatSim): void {
    const boss = sim.boss
    if (!boss || !boss.alive) {
      if (this.bossMesh) this.bossMesh.visible = false
      return
    }
    if (!this.bossMesh || this.bossMesh.userData.bossId !== boss.spec.id) {
      if (this.bossMesh) this.world.remove(this.bossMesh)
      this.bossMesh = buildBoss(boss.spec.shape, boss.spec.color, boss.spec.accent)
      this.bossMesh.userData.bossId = boss.spec.id
      this.world.add(this.bossMesh)
    }
    this.bossMesh.visible = true
    this.bossMesh.position.set(boss.x, boss.y, 0)
    this.bossMesh.rotation.z = Math.sin(sim.time * 0.4) * 0.04
    const flash = boss.flash
    this.bossMesh.traverse((child) => {
      const mesh = child as THREE.Mesh
      const material = mesh.material as THREE.MeshStandardMaterial | undefined
      if (material && 'emissiveIntensity' in material) material.emissiveIntensity = 0.35 + flash * 1.6
    })
    const parts = this.bossMesh.getObjectByName('parts')
    if (parts) {
      parts.children.forEach((part, index) => {
        const state = boss.parts[index]
        part.visible = Boolean(state?.alive)
      })
    }
  }

  private syncBullets(sim: CombatSim): void {
    let friendly = 0
    let hostile = 0
    for (const bullet of sim.bullets) {
      this.dummy.makeTranslation(bullet.x, bullet.y, 0)
      if (bullet.kind === 'wave') this.dummy.scale(new THREE.Vector3(2.4, 1.2, 1))
      else if (bullet.kind === 'missile') this.dummy.scale(new THREE.Vector3(0.8, 1.4, 0.8))
      else this.dummy.scale(new THREE.Vector3(1, 1, 1))
      if (bullet.hostile) {
        if (hostile >= 300) continue
        this.hostileBullets.setMatrixAt(hostile, this.dummy)
        this.hostileBullets.setColorAt(hostile, this.tempColor.set(bullet.color))
        hostile += 1
      } else {
        if (friendly >= 260) continue
        this.friendlyBullets.setMatrixAt(friendly, this.dummy)
        this.friendlyBullets.setColorAt(friendly, this.tempColor.set(bullet.color))
        friendly += 1
      }
    }
    this.hideRest(this.friendlyBullets, friendly, 260)
    this.hideRest(this.hostileBullets, hostile, 300)
  }

  private hideRest(mesh: THREE.InstancedMesh, used: number, capacity: number): void {
    this.dummy.makeScale(0, 0, 0)
    for (let index = used; index < capacity; index += 1) mesh.setMatrixAt(index, this.dummy)
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  private syncPickups(sim: CombatSim): void {
    let used = 0
    for (const pickup of sim.pickups) {
      this.dummy.makeRotationY(performance.now() / 500 + used)
      this.dummy.setPosition(pickup.x, pickup.y, 0)
      this.dummy.scale(new THREE.Vector3(1, 1, 1))
      if (used >= 32) break
      this.pickups.setMatrixAt(used, this.dummy)
      const color = pickup.resource ? '#8ef0c8' : pickup.effect === 'pierce' ? '#e2e8f0' : '#fcd34d'
      this.pickups.setColorAt(used, this.tempColor.set(color))
      used += 1
    }
    this.hideRest(this.pickups, used, 32)
  }

  private syncBeams(sim: CombatSim): void {
    let used = 0
    for (const beam of sim.beams) {
      const mesh = this.beamPool[used]
      if (!mesh) break
      mesh.visible = true
      mesh.position.set(beam.x, 80, 6)
      mesh.scale.set(beam.width, 1, 1)
      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = beam.warm > 0 ? 0.22 + Math.sin(performance.now() / 60) * 0.12 : 0.8
      material.color.set(beam.warm > 0 ? '#fca5a5' : '#fff1f2')
      used += 1
    }
    for (let index = used; index < this.beamPool.length; index += 1) {
      const mesh = this.beamPool[index]
      if (mesh) mesh.visible = false
    }
  }

  private syncStation(sim: CombatSim): void {
    if (!sim.station) {
      if (this.stationMesh) this.stationMesh.visible = false
      return
    }
    if (!this.stationMesh) {
      const group = new THREE.Group()
      const core = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 8), hullMaterial('#334155', '#93c5fd'))
      core.rotation.x = Math.PI / 2
      group.add(core)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(8, 0.7, 8, 24), glowMaterial('#7dd3fc', 1.2))
      ring.name = 'ring'
      group.add(ring)
      this.stationMesh = group
      this.world.add(group)
    }
    this.stationMesh.visible = true
    this.stationMesh.position.set(sim.station.x, sim.station.y, 0)
    const ring = this.stationMesh.getObjectByName('ring')
    if (ring) ring.rotation.z += 0.01
    const ratio = sim.station.hp / sim.station.maxHp
    this.stationMesh.scale.setScalar(0.8 + ratio * 0.2)
  }

  private syncDrones(sim: CombatSim): void {
    while (this.droneMeshes.length < sim.drones.length) {
      const mesh = new THREE.Group()
      const body = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.6, 5), hullMaterial('#cbd5e1', '#4de1ff'))
      body.rotation.x = Math.PI
      mesh.add(body)
      this.world.add(mesh)
      this.droneMeshes.push(mesh)
    }
    this.droneMeshes.forEach((mesh, index) => {
      const drone = sim.drones[index]
      if (!drone) {
        mesh.visible = false
        return
      }
      mesh.visible = true
      mesh.position.set(drone.x, drone.y, 0)
      mesh.rotation.y = sim.time * 2
    })
  }

  private syncAsteroids(sim: CombatSim): void {
    while (this.asteroidMeshes.length < sim.asteroids.length) {
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#78716c', roughness: 0.95, metalness: 0.1 }))
      this.world.add(mesh)
      this.asteroidMeshes.push(mesh)
    }
    this.asteroidMeshes.forEach((mesh, index) => {
      const rock = sim.asteroids[index]
      if (!rock) {
        mesh.visible = false
        return
      }
      mesh.visible = true
      mesh.position.set(rock.x, rock.y, 0)
      mesh.scale.setScalar(rock.r)
      mesh.rotation.set(rock.spin, rock.spin * 0.6, 0)
    })
  }

  // ----------------------------------------------------------------- particles

  private burst(x: number, y: number, size: number, color: string, count?: number): void {
    const preset = QUALITY[this.quality]
    const max = Math.round(preset.particles / 8)
    const total = Math.max(3, Math.min(max, count ?? Math.round(size * 0.8)))
    for (let index = 0; index < total; index += 1) {
      if (this.particles.length >= preset.particles) break
      const angle = Math.random() * TAU
      const speed = 3 + Math.random() * size * 1.6
      this.particles.push({
        x,
        y,
        z: (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 4,
        life: 0.35 + Math.random() * 0.7,
        maxLife: 1,
        size: 0.6 + Math.random() * Math.min(2.6, size * 0.14),
        color: new THREE.Color(color),
      })
    }
  }

  private updateParticles(dt: number): void {
    const capacity = 900
    let drawn = 0
    for (const particle of this.particles) {
      particle.life -= dt
      if (particle.life <= 0) continue
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      particle.z += particle.vz * dt
      particle.vx *= 0.96
      particle.vy *= 0.96
      if (drawn >= capacity) break
      const scale = particle.size * Math.max(0.05, particle.life / particle.maxLife)
      this.dummy.makeScale(scale, scale, scale)
      this.dummy.setPosition(particle.x, particle.y, particle.z)
      this.particleMesh.setMatrixAt(drawn, this.dummy)
      this.particleMesh.setColorAt(drawn, particle.color)
      drawn += 1
    }
    this.hideRest(this.particleMesh, drawn, capacity)
    this.particles.splice(
      0,
      this.particles.length,
      ...this.particles.filter((particle) => particle.life > 0),
    )
    if (this.particles.length > capacity) this.particles.length = capacity
  }

  dispose(): void {
    this.renderer.dispose()
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh
      mesh.geometry?.dispose()
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(material)) material.forEach((entry) => entry.dispose())
      else material?.dispose()
    })
  }
}

// ---------------------------------------------------------------- model builders

function buildShip(shape: string, hull: string, accent: string): THREE.Group {
  const group = new THREE.Group()
  const body = new THREE.Mesh(new THREE.ConeGeometry(2.2, 8, 6), hullMaterial(hull, accent))
  body.rotation.x = Math.PI
  body.position.y = 1.2
  group.add(body)

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.15, 12, 10), glowMaterial(accent, 1.4, 0.1))
  canopy.position.set(0, 1.4, 0.6)
  canopy.scale.set(1, 0.8, 0.7)
  group.add(canopy)

  const wingConfig: Record<string, { span: number; sweep: number; count: number; height: number }> = {
    falcon: { span: 6.4, sweep: 0.5, count: 2, height: 0.4 },
    viper: { span: 5.2, sweep: 0.9, count: 2, height: 0.3 },
    titan: { span: 8.6, sweep: 0.2, count: 2, height: 0.9 },
    spear: { span: 4.4, sweep: 1.2, count: 2, height: 0.25 },
    phantom: { span: 7.2, sweep: 0.85, count: 2, height: 0.3 },
    phoenix: { span: 7.4, sweep: 0.35, count: 2, height: 0.6 },
    sentinel: { span: 6.8, sweep: 0.1, count: 2, height: 1.1 },
    tempest: { span: 6.6, sweep: 0.7, count: 2, height: 0.4 },
    eclipse: { span: 7.8, sweep: 0.95, count: 2, height: 0.35 },
    prime: { span: 8.2, sweep: 0.45, count: 2, height: 0.7 },
  }
  const config = wingConfig[shape] ?? wingConfig.falcon!
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(config.span / 2, config.height + 0.5, 2.2), hullMaterial(hull, accent))
    wing.position.set((side * config.span) / 4, -0.5, 0)
    wing.rotation.z = side * config.sweep * 0.22
    group.add(wing)
    const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, config.span / 3, 3, 6), glowMaterial(accent, 1.3))
    tip.rotation.z = Math.PI / 2
    tip.position.set((side * config.span) / 2.2, -0.9, 0)
    group.add(tip)
  }
  if (config.count > 2) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 1.4), hullMaterial(hull, accent))
    fin.position.set(0, 2.4, -0.6)
    group.add(fin)
  }

  const engine = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 1.6, 8), glowMaterial('#ffffff', 2.2, 0.1))
  engine.position.set(0, -3.4, 0)
  group.add(engine)
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 3.4, 8),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }),
  )
  flame.rotation.x = 0
  flame.position.set(0, -5.4, 0)
  group.add(flame)

  const shield = new THREE.Mesh(
    new THREE.SphereGeometry(6.6, 20, 14),
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  shield.name = 'shield'
  group.add(shield)
  addToonOutline(group, 1.1)
  return group
}

function buildEnemy(shape: string, color: string, accent: string, behavior: string): THREE.Group {
  const group = new THREE.Group()
  const hull = hullMaterial(color, accent)
  const trim = glowMaterial(accent, 1.2)

  switch (shape) {
    case 'dart': {
      const body = new THREE.Mesh(new THREE.ConeGeometry(1.7, 6, 5), hull)
      body.rotation.x = Math.PI
      group.add(body)
      const fin = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.4, 1.2), hull)
      fin.position.y = -0.8
      group.add(fin)
      break
    }
    case 'wedge': {
      const body = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5, 3), hull)
      body.rotation.x = Math.PI
      group.add(body)
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), trim)
      eye.position.set(0, -0.6, 1.2)
      group.add(eye)
      break
    }
    case 'hex': {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3.2, 6), hull)
      body.rotation.x = Math.PI / 2
      group.add(body)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.28, 6, 18), trim)
      group.add(ring)
      break
    }
    case 'orb': {
      const body = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 10), hull)
      group.add(body)
      const band = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.24, 6, 20), trim)
      band.rotation.x = Math.PI / 2.4
      group.add(band)
      break
    }
    case 'cruiser': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 7.5, 3), hull)
      group.add(body)
      const nose = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 5), hull)
      nose.position.y = -5
      nose.rotation.x = Math.PI
      group.add(nose)
      for (const side of [-1, 1]) {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.4, 6), trim)
        pod.rotation.z = Math.PI / 2
        pod.position.set(side * 3.6, 1.2, 0)
        group.add(pod)
      }
      break
    }
    case 'organic': {
      const body = new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 0), hull)
      body.scale.set(1, 0.8, 1)
      group.add(body)
      for (const side of [-1, 1]) {
        const arm = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.4, 4), trim)
        arm.position.set(side * 2.6, -0.6, 0)
        arm.rotation.z = side * 0.8
        group.add(arm)
      }
      break
    }
    case 'ring': {
      const body = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.8, 8, 20), trim)
      group.add(body)
      const core = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 8), hull)
      group.add(core)
      break
    }
    default: {
      const body = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 5), hull)
      body.rotation.x = Math.PI
      group.add(body)
    }
  }

  if (behavior === 'shield') {
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(4.4, 16, 12),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.7, transparent: true, opacity: 0.16, depthWrite: false }),
    )
    group.add(bubble)
  }
  addToonOutline(group, 1.12)
  return group
}

function buildBoss(shape: string, color: string, accent: string): THREE.Group {
  const group = new THREE.Group()
  const hull = hullMaterial(color, accent)
  const trim = glowMaterial(accent, 1.4)

  switch (shape) {
    case 'serpent': {
      for (let index = 0; index < 6; index += 1) {
        const segment = new THREE.Mesh(new THREE.SphereGeometry(7 - index * 0.6, 14, 10), hull)
        segment.position.set(Math.sin(index * 0.9) * 6, index * 3 - 8, 0)
        group.add(segment)
      }
      const head = new THREE.Mesh(new THREE.ConeGeometry(7, 14, 6), trim)
      head.rotation.x = Math.PI
      head.position.y = -14
      group.add(head)
      break
    }
    case 'crystal': {
      for (let index = 0; index < 8; index += 1) {
        const shard = new THREE.Mesh(new THREE.OctahedronGeometry(6.5, 0), index % 2 === 0 ? hull : trim)
        const angle = (index / 8) * TAU
        shard.position.set(Math.cos(angle) * 11, Math.sin(angle) * 7, 0)
        shard.rotation.z = angle
        group.add(shard)
      }
      const core = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 12), trim)
      group.add(core)
      break
    }
    case 'carrier':
    case 'ark':
      group.add(new THREE.Mesh(new THREE.BoxGeometry(34, 12, 8), hull))
      group.add(new THREE.Mesh(new THREE.BoxGeometry(14, 7, 6), trim))
      for (const side of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(8, 18, 5), hull)
        wing.position.set(side * 18, -2, 0)
        group.add(wing)
      }
      break
    case 'leviathan':
    case 'harbinger': {
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(9, 22, 6, 14), hull)
      body.rotation.z = Math.PI / 2
      group.add(body)
      for (const side of [-1, 1]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(13, 1.1, 8, 30), trim)
        ring.position.set(side * 7, 0, 0)
        ring.rotation.y = Math.PI / 2
        group.add(ring)
      }
      break
    }
    case 'volt':
    case 'fortress': {
      group.add(new THREE.Mesh(new THREE.BoxGeometry(30, 20, 10), hull))
      for (let index = 0; index < 4; index += 1) {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(32 - index * 3, 2.2, 11), trim)
        plate.position.y = -8 + index * 5
        group.add(plate)
      }
      break
    }
    case 'devourer': {
      const core = new THREE.Mesh(new THREE.SphereGeometry(15, 20, 16), hull)
      group.add(core)
      for (let index = 0; index < 10; index += 1) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(2.6, 13, 4), trim)
        const angle = (index / 10) * TAU
        spike.position.set(Math.cos(angle) * 16, Math.sin(angle) * 12, 0)
        spike.rotation.z = angle - Math.PI / 2
        group.add(spike)
      }
      const halo = new THREE.Mesh(new THREE.TorusGeometry(24, 1.2, 8, 44), trim)
      halo.name = 'halo'
      group.add(halo)
      break
    }
    default: {
      group.add(new THREE.Mesh(new THREE.BoxGeometry(36, 16, 9), hull))
      const prow = new THREE.Mesh(new THREE.ConeGeometry(8, 16, 6), trim)
      prow.rotation.x = Math.PI
      group.add(prow)
    }
  }

  const parts = new THREE.Group()
  parts.name = 'parts'
  for (let index = 0; index < 10; index += 1) {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 4.4, 6), glowMaterial(accent, 1.6))
    const angle = (index / 10) * TAU
    turret.position.set(Math.cos(angle) * 15, Math.sin(angle) * 9, 4)
    turret.rotation.x = Math.PI / 2
    parts.add(turret)
  }
  group.add(parts)
  addToonOutline(group, 1.06)
  return group
}
