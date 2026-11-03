/**
 * Browser smoke test: the real production build in a portrait phone viewport.
 * Drives the menu, opens mission 1, drags the ship, checks automatic fire,
 * grants a power-up, pauses, wins, and advances to the next mission.
 *
 *   node scripts/smoke.mjs [url]
 */
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5199/'
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
})
const page = await context.newPage()

const errors = []
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`)
})

const shot = async (name) => {
  await page.screenshot({ path: `/tmp/ss-${name}.png` })
  console.log(`  screenshot /tmp/ss-${name}.png`)
}
const state = () => page.evaluate(() => window.__ss?.state() ?? null)

const fail = (message) => {
  console.error(`FAIL: ${message}`)
  process.exit(1)
}

await page.goto(url, { waitUntil: 'load' })
await page.waitForSelector('.title', { timeout: 60000 })
await page.waitForFunction(() => window.__ss !== undefined, { timeout: 20000 })
console.log('menu rendered')
await shot('menu')

await page.click('[data-action="continue"]')
await page.waitForSelector('#hud', { timeout: 20000 })
const opening = await state()
console.log('mission opened:', opening?.mission)
if (!opening || opening.phase !== 'active') fail('mission did not start')

const rect = await page.locator('#scene').boundingBox()
if (!rect) fail('canvas has no bounding box')

await page.mouse.move(rect.x + rect.width * 0.5, rect.y + rect.height * 0.72)
await page.mouse.down()
for (let step = 1; step <= 8; step += 1) {
  await page.mouse.move(rect.x + rect.width * (0.5 - step * 0.04), rect.y + rect.height * 0.72)
  await page.waitForTimeout(30)
}
await page.mouse.up()
await page.waitForTimeout(400)
const moved = await state()
console.log(`ship x: ${opening.playerX} -> ${moved?.playerX}`)
if (!moved || Math.abs(moved.playerX - opening.playerX) < 3) fail('dragging did not move the ship')
if (!moved || moved.bullets < 1) fail('the cannon is not firing automatically')
await shot('playing')

await page.evaluate(() => window.__ss?.grant('twinDrone'))
await page.waitForTimeout(400)
const drones = await state()
console.log('drones after pickup:', drones?.drones)
if (!drones || drones.drones < 2) fail('drone power-up did not add drones')

await page.evaluate(() => window.__ss?.pause())
await page.waitForSelector('.overlay .sheet', { timeout: 5000 })
console.log('pause overlay:', (await page.textContent('.sheet h2'))?.trim())
await shot('pause')
await page.click('[data-action="resume"]')
await page.waitForTimeout(200)

await page.evaluate(() => window.__ss?.win())
await page.waitForSelector('.sheet.result', { timeout: 10000 })
const resultTitle = (await page.textContent('.sheet.result h2'))?.trim()
console.log('result:', resultTitle)
await shot('result')
if (!resultTitle) fail('result sheet did not render')

await page.click('[data-action="next"]')
await page.waitForTimeout(700)
const next = await state()
console.log('next mission:', next?.mission)
if (!next || next.mission === opening.mission) fail('next mission did not start')

for (const problem of errors) console.error(problem)
if (errors.length > 0) fail(`${errors.length} browser errors`)
console.log('smoke test passed')
await browser.close()
