/* eslint-disable @typescript-eslint/no-require-imports -- Optional external Playwright runner, matching test-learning-labs.cjs. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.LAB_TEST_URL || 'http://localhost:3000';
const output = '.impeccable/review/computer-science';
const tracks = ['software', 'embedded-system', 'networking', 'multimedia'];
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  async function frameContains(selector) {
    assert.equal(await page.locator(selector).evaluateAll(elements => elements.every(element => {
      const frame = element.closest('.cs-simulation');
      if (!frame) return false;
      const outer = frame.getBoundingClientRect();
      const inner = element.getBoundingClientRect();
      return inner.left >= outer.left && inner.right <= outer.right && inner.top >= outer.top && inner.bottom <= outer.bottom;
    })), true, selector + ' must stay inside the simulation frame');
  }
  try {
    for (const track of tracks) {
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
        await page.goto(`${base}/computer-science/${track}`);
        await page.locator('.cs-room-art').waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${track} ${width} overflow`);
        await frameContains('.cs-instructor, .cs-dialogue, .cs-narration, .cs-dialogue button');
        if (width !== 320) await page.screenshot({ path: `${output}/${track}-intro-${width}.png`, fullPage: true });
        const first = await page.locator('.cs-dialogue-text').textContent();
        await page.getByRole('button', { name: 'Continue', exact: true }).focus();
        await page.keyboard.press('Enter');
        assert.notEqual(await page.locator('.cs-dialogue-text').textContent(), first);
        await page.getByRole('button', { name: 'Back', exact: true }).click();
        assert.equal(await page.locator('.cs-dialogue-text').textContent(), first);
        assert.equal(await page.locator('.cs-dialogue-text').count(), 1);
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}/computer-science/software`);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Start creating website' }).click();
    assert.equal(await page.locator('.lab-workspace-heading h2').evaluate(element => element === document.activeElement), true, 'Starting moves focus into the workbench');
    await frameContains('.lab-guide, .cs-guide-portrait, .lab-guide button');
    await page.getByRole('textbox', { name: 'HTML code editor' }).fill('<h1>Hello World</h1>');
    await page.getByRole('button', { name: 'Review this step' }).click();
    assert.equal(await page.locator('.cs-instructor--encouraging').count(), 1);
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    assert.equal(await page.locator('.cs-step-copy').count(), 1, 'Only the current instruction is rendered');
    assert.equal(await page.locator('.lab-guide h2').evaluate(element => element === document.activeElement), true, 'Step changes move focus to the current instruction');
    await page.getByRole('button', { name: 'Back to class' }).click();
    await page.getByRole('button', { name: 'Keep working' }).click();
    assert.equal(await page.getByRole('textbox', { name: 'HTML code editor' }).inputValue(), '<h1>Hello World</h1>');
    await page.getByRole('button', { name: 'Back to class' }).click();
    await page.getByRole('button', { name: 'Return to class', exact: true }).click();
    assert.equal(await page.locator('.cs-dialogue-text').count(), 1);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Start creating website' }).click();
    assert.equal(await page.getByRole('textbox', { name: 'HTML code editor' }).inputValue(), '<!-- Build your page below. -->\n');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.cs-instructor-body').evaluate(element => getComputedStyle(element).animationName), 'none');
    await page.getByRole('button', { name: 'Review this step' }).click();
    assert.equal(await page.locator('.cs-instructor--thinking').count(), 1);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    assert.notEqual(await page.locator('.cs-instructor-body').evaluate(element => getComputedStyle(element).animationName), 'none');
    for (const route of ['/medicine/emergency', '/medicine/surgery', '/medicine/pediatrics', '/medicine/radiology', '/law/criminal-law', '/law/civil-law', '/law/business-commercial-law', '/law/constitutional-administrative-law', '/computer-science/software/simulation/coding', '/computer-science/software/simulation/logic-flow', '/computer-science/software/simulation/database']) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      if (route.includes('/simulation/')) await page.locator('button').first().waitFor();
      else await page.locator('h1,h2').first().waitFor();
    }
    assert.deepEqual(errors, [], 'No uncaught browser errors or React console errors');
    console.log('PASS: in-frame containment at 1440/390/320px; keyboard dialogue; one current instruction; focus; restart/cancel; expressions; reduced motion; Medicine/Law and legacy route smoke checks.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
