/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS runner with an optional Playwright installation. */
// Run with PLAYWRIGHT_MODULE pointing to an installed @playwright/test package if it is not local.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.LAB_TEST_URL || 'http://localhost:3000';
const output = path.join(process.cwd(), '.impeccable', 'review', 'computer-science');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const review = () => page.getByRole('button', { name: 'Review this step', exact: true });
  const next = () => page.getByRole('button', { name: 'Next step', exact: true });
  async function checkedNext() {
    await review().click();
    assert.equal(await next().isEnabled(), true, 'Valid work must unlock the next step');
    await next().click();
  }
  async function finish() {
    await review().click();
    await page.getByRole('button', { name: 'Finish project', exact: true }).click();
    await page.getByRole('heading', { name: 'You made it happen.' }).waitFor();
  }
  async function screenshot(name) {
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `${name}: horizontal overflow`);
  }
  async function begin(track) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}/computer-science/${track}`);
    await page.locator('.lab-scene img').waitFor();
    await page.locator('.lab-scene img').evaluate(async image => { if (!image.complete) await new Promise(resolve => image.addEventListener('load', resolve, { once: true })); });
    await screenshot(`${track}-classroom`);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.locator('.lab-dialogue-actions .lab-primary').click();
    await page.locator('.lab-workspace').waitFor();
    assert.equal(await next().isDisabled(), true, 'Steps start locked until review');
    await review().click();
    assert.equal(await next().isDisabled(), true, 'Empty work cannot pass');
    await page.setViewportSize({ width: 390, height: 844 });
    await screenshot(`${track}-mobile`);
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  async function range(label, value, min = 50, step = 5) {
    const slider = page.getByRole('slider', { name: label, exact: true });
    await slider.focus(); await slider.press('Home');
    for (let i = 0; i < (value - min) / step; i++) await slider.press('ArrowRight');
  }

  try {
    // Homepage options belong to the selected major, and all four routes are real.
    await page.goto(base);
    await page.getByRole('button', { name: 'Preview Law simulation', exact: true }).click();
    assert.equal(await page.locator('#simulation-track-select').count(), 0, 'Law must not inherit CS tracks');
    await page.getByRole('button', { name: 'Close preview' }).click();
    await page.getByRole('button', { name: 'Preview Computer Science simulation', exact: true }).click();
    for (const track of ['software', 'embedded-system', 'networking', 'multimedia']) {
      await page.locator('#simulation-track-select').selectOption(track);
      assert.equal(await page.getByRole('link', { name: 'Try Simulation' }).getAttribute('href'), `/computer-science/${track}`);
    }

    await begin('software');
    const editor = page.getByRole('textbox', { name: 'HTML code editor' });
    await editor.focus(); await page.keyboard.press('Tab');
    assert.equal(await editor.evaluate(element => document.activeElement === element), false, 'Tab must let keyboard users leave the editor');
    await editor.focus(); await page.keyboard.press('Shift+Tab');
    assert.equal(await editor.evaluate(element => document.activeElement === element), false, 'Shift+Tab must leave the editor');
    let code = '<h1>Hello World</h1>';
    await editor.fill(code); await review().click(); assert.equal(await next().isEnabled(), true);
    await editor.fill('<h1>Incorrect</h1>'); assert.equal(await next().isDisabled(), true, 'Editing invalidates a successful review');
    await editor.fill(code); await checkedNext();
    code += '\n<p>My goal is to build useful tools for my community.</p>'; await editor.fill(code); await checkedNext();
    code += '\n<ul><li>HTML</li><li>CSS</li><li>Accessibility</li></ul>'; await editor.fill(code); await checkedNext();
    code += '\n<a href="https://developer.mozilla.org">Learn web development</a>'; await editor.fill(code); await checkedNext();
    code += '\n<style>body { background-color: #f4f7ef; } h1 { color: #265c45; }</style>'; await editor.fill(code);
    await page.frameLocator('iframe').getByRole('heading', { name: 'Hello World' }).waitFor();
    await editor.evaluate(element => { element.scrollLeft = 0; });
    await screenshot('software-desktop'); await finish();
    const websiteDownload = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download website' }).click();
    assert.equal((await websiteDownload).suggestedFilename(), 'my-first-website.html');
    code += '\n<!-- A new experiment -->'; await editor.fill(code);
    assert.equal(await page.getByRole('heading', { name: 'You made it happen.' }).count(), 0, 'Changing a finished project clears completion');
    await finish();
    await page.getByRole('button', { name: 'Keep experimenting' }).click();
    await page.getByRole('button', { name: 'Previous instructions' }).click();
    await page.getByRole('heading', { name: 'Connect an idea' }).waitFor();
    assert.equal(await editor.inputValue(), code, 'Earlier instructions preserve the project');

    await begin('embedded-system');
    await page.locator('.lab-part-item').filter({ hasText: '3 V battery' }).dragTo(page.getByRole('button', { name: 'Place 3 V battery', exact: true }));
    await checkedNext();
    await page.getByRole('button', { name: 'Place Push button', exact: true }).click(); await checkedNext();
    await page.getByRole('button', { name: 'Place 220 Ω resistor', exact: true }).click();
    await page.getByRole('button', { name: 'Place Red LED', exact: true }).click(); await checkedNext();
    for (const [from, to] of [['Battery +', 'Button A'], ['Button B', 'Resistor A'], ['Resistor B', 'LED +'], ['LED −', 'Battery −']]) {
      await page.getByRole('button', { name: `Connect ${from}`, exact: true }).click();
      await page.getByRole('button', { name: `Connect ${to}`, exact: true }).click();
    }
    await checkedNext();
    assert.equal(await page.getByRole('button', { name: 'Connect Battery +', exact: true }).evaluate(element => {
      const area = getComputedStyle(element, '::before');
      return parseFloat(area.width) >= 24 && parseFloat(area.height) >= 24;
    }), true, 'Terminal hit areas must be at least 24 by 24 pixels');
    const testButton = page.getByRole('button', { name: 'Hold to test LED', exact: true });
    await testButton.focus(); await page.keyboard.down('Space');
    assert.equal(await page.locator('.lab-breadboard .lab-led-bulb').getAttribute('fill'), '#ff705b', 'LED lights while button is held');
    await page.keyboard.up('Space');
    assert.equal(await page.locator('.lab-breadboard .lab-led-bulb').getAttribute('fill'), '#9b3c37', 'LED turns off on release');
    await screenshot('embedded-system-desktop'); await finish();

    await begin('networking');
    await page.getByRole('button', { name: 'Send ping', exact: true }).click();
    await page.getByText('Request failed:', { exact: false }).waitFor();
    for (const pc of ['PC-1', 'PC-2']) {
      await page.getByRole('button', { name: `Connect ${pc}`, exact: true }).click();
      await page.getByRole('button', { name: 'Connect Switch', exact: true }).click();
    }
    await checkedNext();
    await page.getByRole('textbox', { name: 'PC-1 IP address' }).fill('192.168.1.10');
    await page.getByRole('textbox', { name: 'PC-2 IP address' }).fill('192.168.1.10');
    await page.getByRole('button', { name: 'Send ping', exact: true }).click();
    await page.getByText('Two devices have the same IP address.', { exact: false }).waitFor();
    await review().click(); assert.equal(await next().isDisabled(), true, 'Duplicate addresses cannot pass');
    await page.getByRole('textbox', { name: 'PC-2 IP address' }).fill('192.168.1.11'); await checkedNext();
    await page.getByRole('button', { name: 'Send ping', exact: true }).click();
    assert.equal(await page.locator('.lab-packet').count(), 1, 'A successful ping creates an animated envelope');
    await checkedNext();
    await page.getByRole('button', { name: 'Connect Router', exact: true }).click();
    await page.getByRole('button', { name: 'Connect Switch', exact: true }).click();
    await page.getByLabel('Ping destination', { exact: true }).selectOption('router');
    await page.getByRole('button', { name: 'Send ping', exact: true }).click();
    await screenshot('networking-desktop'); await finish();

    await begin('multimedia');
    const poster = page.locator('.lab-poster');
    const bounds = await poster.boundingBox();
    await page.locator('.lab-palette-item').filter({ hasText: 'Headline' }).dragTo(poster, { targetPosition: { x: bounds.width / 2, y: bounds.height * .15 } });
    await checkedNext();
    await page.locator('.lab-palette-item').filter({ hasText: 'Product image' }).click(); await checkedNext();
    await page.locator('.lab-palette-item').filter({ hasText: 'Price & offer' }).click();
    await page.locator('.lab-palette-item').filter({ hasText: 'Call to action' }).click(); await checkedNext();
    await range('Brightness', 110); await range('Contrast', 115); await checkedNext();
    await range('Saturation', 120); await screenshot('multimedia-desktop'); await finish();
    const posterDownload = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download poster' }).click();
    const downloadedPoster = await posterDownload;
    assert.equal(downloadedPoster.suggestedFilename(), 'everyday-poster.svg');
    const svg = fs.readFileSync(await downloadedPoster.path(), 'utf8');
    assert.match(svg, /feColorMatrix type="saturate" values="1.2"/);
    assert.match(svg, /Refill/);
    assert.deepEqual(errors, [], 'No uncaught browser errors');
    console.log('PASS: all four full lessons, invalid work, review locking, downloads, homepage routing, and mobile overflow checks.');
    console.log(`Screenshots: ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
