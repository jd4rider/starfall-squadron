import type { QualityId } from '../core/constants'

export interface SectorSpec {
  id: number
  name: string
  subtitle: string
  blurb: string
  faction: string
  boss: string
  terrain: string
  palette: {
    sky: string
    nebula: string
    nebula2: string
    accent: string
    planet: string
    fog: string
  }
}

export const FACTIONS: Record<string, { name: string; hull: string; accent: string; glow: string }> = {
  crimson: { name: 'Crimson Swarm', hull: '#8e2233', accent: '#ff7a59', glow: '#ffb27a' },
  void: { name: 'Void Collective', hull: '#2c2352', accent: '#a78bfa', glow: '#d8b4fe' },
  iron: { name: 'Iron Dominion', hull: '#434b5a', accent: '#f59e0b', glow: '#fcd34d' },
  crystal: { name: 'Crystal Legion', hull: '#1d5c6b', accent: '#67e8f9', glow: '#cffafe' },
  bioforge: { name: 'Bioforge Hive', hull: '#3f4f24', accent: '#a3e635', glow: '#d9f99d' },
  eclipse: { name: 'Eclipse Armada', hull: '#2a1c3d', accent: '#f472b6', glow: '#fbcfe8' },
}

export const SECTORS: SectorSpec[] = [
  {
    id: 1,
    name: 'Frontier Patrol',
    subtitle: 'Where the squadron begins',
    blurb: 'Bright nebula dust, easy patrols and the first real capital ship.',
    faction: 'crimson',
    boss: 'dreadnought',
    terrain: 'nebula',
    palette: { sky: '#05091a', nebula: '#2b3d8f', nebula2: '#7c3f8c', accent: '#4de1ff', planet: '#3b6ea8', fog: '#070c22' },
  },
  {
    id: 2,
    name: 'Crimson Nebula',
    subtitle: 'Ash on every wing',
    blurb: 'Red gas fields, dive bombers and a serpent that never sits still.',
    faction: 'crimson',
    boss: 'serpent',
    terrain: 'dust',
    palette: { sky: '#160610', nebula: '#8f2238', nebula2: '#ff7a59', accent: '#ff8a5c', planet: '#a23c3c', fog: '#1c0810' },
  },
  {
    id: 3,
    name: 'Crystal Expanse',
    subtitle: 'Light with edges',
    blurb: 'Reflective debris and shield carriers that punish sloppy aim.',
    faction: 'crystal',
    boss: 'empress',
    terrain: 'crystal',
    palette: { sky: '#04141c', nebula: '#0e7490', nebula2: '#67e8f9', accent: '#67e8f9', planet: '#155e75', fog: '#061a24' },
  },
  {
    id: 4,
    name: 'Inferno Belt',
    subtitle: 'Keep clear of the rocks',
    blurb: 'Asteroids, bombers and a carrier that fills the sky with fire.',
    faction: 'iron',
    boss: 'inferno',
    terrain: 'asteroid',
    palette: { sky: '#190a04', nebula: '#b45309', nebula2: '#f97316', accent: '#fb923c', planet: '#7c2d12', fog: '#1d0d05' },
  },
  {
    id: 5,
    name: 'Frozen Void',
    subtitle: 'Silence, then ice',
    blurb: 'Slow-moving slabs of ice and a leviathan that freezes your wings.',
    faction: 'crystal',
    boss: 'leviathan',
    terrain: 'ice',
    palette: { sky: '#040d18', nebula: '#1e4d7b', nebula2: '#bfe9ff', accent: '#93c5fd', planet: '#1e3a5f', fog: '#06121f' },
  },
  {
    id: 6,
    name: 'Electric Frontier',
    subtitle: 'Everything hums',
    blurb: 'EMP ships, chain lightning and a sovereign made of storms.',
    faction: 'void',
    boss: 'sovereign',
    terrain: 'storm',
    palette: { sky: '#0a0620', nebula: '#4c1d95', nebula2: '#a78bfa', accent: '#c4b5fd', planet: '#312e81', fog: '#0d0824' },
  },
  {
    id: 7,
    name: 'Gravity Rift',
    subtitle: 'Aim is a suggestion',
    blurb: 'Warped space bends every shot and a harbinger that pulls you in.',
    faction: 'void',
    boss: 'harbinger',
    terrain: 'rift',
    palette: { sky: '#0b0416', nebula: '#6b21a8', nebula2: '#f0abfc', accent: '#e879f9', planet: '#4c1d95', fog: '#120624' },
  },
  {
    id: 8,
    name: 'Phantom Sector',
    subtitle: 'Nothing stays put',
    blurb: 'Teleporting raiders, decoys and an ark that is never where you aim.',
    faction: 'eclipse',
    boss: 'ark',
    terrain: 'phantom',
    palette: { sky: '#0b0716', nebula: '#831843', nebula2: '#f472b6', accent: '#f9a8d4', planet: '#500724', fog: '#150a1c' },
  },
  {
    id: 9,
    name: 'Iron Dominion',
    subtitle: 'Armour all the way down',
    blurb: 'Capital ships, heavy guns and a fortress that shrugs off everything.',
    faction: 'iron',
    boss: 'behemoth',
    terrain: 'fortress',
    palette: { sky: '#0d0f14', nebula: '#78350f', nebula2: '#fbbf24', accent: '#fcd34d', planet: '#57534e', fog: '#12141a' },
  },
  {
    id: 10,
    name: 'Starfall Citadel',
    subtitle: 'The last sky',
    blurb: 'Every mechanic at once, ending at the Devourer itself.',
    faction: 'eclipse',
    boss: 'devourer',
    terrain: 'citadel',
    palette: { sky: '#05030f', nebula: '#1e1b4b', nebula2: '#38bdf8', accent: '#7dd3fc', planet: '#0f172a', fog: '#08061a' },
  },
]

export function sectorById(id: number): SectorSpec {
  return SECTORS[Math.max(0, Math.min(SECTORS.length - 1, id - 1))] as SectorSpec
}

export const QUALITY_LABEL: Record<QualityId, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
