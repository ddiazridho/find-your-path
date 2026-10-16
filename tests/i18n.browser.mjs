import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';

const messages = JSON.parse(await readFile('app/i18n/id.json', 'utf8'));
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = process.env.QUIZ_TEST_URL ?? 'http://127.0.0.1:3000';
const routes = ['/', '/quiz', '/quiz/results', '/rekomendasi-universitas', '/computer-science/software', '/computer-science/embedded-system', '/computer-science/networking', '/computer-science/multimedia', '/computer-science/software/simulation/coding', '/computer-science/software/simulation/database', '/computer-science/software/simulation/logic-flow', '/law/civil-law', '/law/criminal-law', '/law/business-commercial-law', '/law/constitutional-administrative-law', '/medicine/emergency', '/medicine/surgery', '/medicine/pediatrics', '/medicine/radiology'];
const report = [];
try {
  for (const route of routes) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    await page.locator('.global-navbar-language').waitFor();
    await page.waitForFunction(() => document.documentElement.lang === 'id');
    const untranslated = await page.evaluate(messages => {
      const normalize = value => value.replace(/\s+/g, ' ').trim();
      const lookup = new Map(Object.entries(messages).map(([key, value]) => [normalize(key), value]));
      const nodes = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest('script,style,nextjs-portal,textarea')) continue;
        const value = normalize(node.textContent);
        const expected = lookup.get(value);
        if (expected && normalize(expected) !== value) nodes.push(value);
      }
      for (const element of document.querySelectorAll('[aria-label],[placeholder],[alt],[title]')) for (const attr of ['aria-label', 'placeholder', 'alt', 'title']) {
        const value = element.getAttribute(attr);
        const expected = value && lookup.get(normalize(value));
        if (expected && normalize(expected) !== normalize(value)) nodes.push(`${attr}: ${value}`);
      }
      return [...new Set(nodes)];
    }, messages);
    report.push({ route, untranslated });
    await page.locator('.global-navbar-language').click();
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await page.locator('.global-navbar-language').click();
    await page.waitForFunction(() => document.documentElement.lang === 'id');
  }
  await page.goto(base + '/');
  await page.getByRole('searchbox', { name: 'Cari jurusan atau keterampilan' }).fill('kedokteran');
  await page.getByRole('heading', { name: 'Kedokteran', exact: true }).waitFor();
  assert.equal(await page.locator('.major-card').count(), 1, 'Indonesian search');
  await page.locator('.global-navbar-language').click();
  await page.getByRole('searchbox', { name: 'Search majors or skills' }).waitFor();
  assert.equal(await page.getByRole('searchbox').inputValue(), 'kedokteran', 'search survives language change');
  await page.reload();
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.locator('.global-navbar-language').click();
  await page.getByRole('searchbox').fill('');
  await mkdir('.impeccable/review/i18n', { recursive: true });
  for (const width of [1366, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `home overflow at ${width}`);
    const button = await page.locator('.global-navbar-language').boundingBox();
    assert.ok(button.x + button.width <= width, `language switch fits at ${width}`);
    if (process.env.I18N_SCREENSHOTS === '1') await page.screenshot({ path: `.impeccable/review/i18n/home-${width}.png`, fullPage: true });
  }
  await page.goto(base + '/quiz');
  await page.getByRole('button', { name: 'Mulai Asesmen', exact: true }).click();
  await page.getByRole('radio').nth(3).check();
  await page.locator('.global-navbar-language').click();
  assert.equal(await page.getByRole('radio').nth(3).isChecked(), true, 'quiz answer survives language change');
  await page.getByRole('heading', { name: 'I am interested in assembling or repairing electronic devices.' }).waitFor();
  await page.goto(base + '/computer-science/software');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Start creating website' }).click();
  const editor = page.getByRole('textbox', { name: 'HTML code editor' });
  await editor.fill('<h1>Hello World</h1><p>Tujuanku tetap tersimpan.</p>');
  await page.locator('.global-navbar-language').click();
  assert.equal(await page.getByRole('textbox', { name: 'Editor kode HTML' }).inputValue(), '<h1>Hello World</h1><p>Tujuanku tetap tersimpan.</p>', 'project survives language change');
  await page.getByRole('button', { name: 'Periksa langkah ini' }).click();
  await page.getByText('Langkah selesai. Hasil kerjamu sudah sesuai!', { exact: true }).waitFor();
  await page.goto(base + '/computer-science/multimedia');
  await page.getByRole('button', { name: 'Lanjutkan', exact: true }).click();
  await page.getByRole('button', { name: 'Lanjutkan', exact: true }).click();
  await page.getByRole('button', { name: 'Mulai merancang poster' }).click();
  async function reviewAndNext(last = false) {
    await page.getByRole('button', { name: 'Periksa langkah ini' }).click();
    await page.getByRole('button', { name: last ? 'Selesaikan proyek' : 'Langkah berikutnya', exact: true }).click();
  }
  await page.locator('.lab-palette-item').nth(0).click();
  assert.equal(await page.getByRole('textbox', { name: 'Teks elemen' }).inputValue(), 'Isi ulang. Pakai lagi. Ulangi.');
  await reviewAndNext();
  await page.locator('.lab-palette-item').nth(1).click();
  await reviewAndNext();
  await page.locator('.lab-palette-item').nth(2).click();
  await page.locator('.lab-palette-item').nth(3).click();
  await reviewAndNext();
  for (const [name, count] of [['Kecerahan', 2], ['Kontras', 3]]) {
    await page.getByRole('slider', { name, exact: true }).focus();
    for (let index = 0; index < count; index++) await page.keyboard.press('ArrowRight');
  }
  await reviewAndNext();
  await page.getByRole('slider', { name: 'Saturasi', exact: true }).focus();
  for (let index = 0; index < 4; index++) await page.keyboard.press('ArrowRight');
  await reviewAndNext(true);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Unduh poster' }).click();
  const download = await downloadPromise;
  const svg = await readFile(await download.path(), 'utf8');
  assert.ok(svg.includes('ISI ULANG SEMANGATMU'), 'downloaded illustration is localized');
  assert.ok(svg.includes('Isi ulang.'), 'downloaded poster copy is localized');
  assert.equal(svg.includes('REFILL YOUR DAY'), false);
  await page.goto(base + '/law/criminal-law');
  await page.getByRole('button', { name: 'Lanjutkan', exact: true }).click();
  const chapter = await page.locator('.law-experience-top').innerText();
  await page.locator('.global-navbar-language').click();
  await page.waitForFunction(() => document.querySelector('#scene-heading')?.textContent.includes('Maya had a staff badge'));
  assert.ok((await page.locator('#scene-heading').innerText()).includes('Maya had a staff badge'), 'story stays on the same scene');
  await page.locator('.global-navbar-language').click();
  assert.equal(await page.locator('.law-experience-top').innerText(), chapter, 'story progress survives switching');
  await page.goto(base + '/missing-page-i18n');
  await page.getByRole('heading', { name: 'Halaman tidak ditemukan' }).waitFor();
  await page.locator('.global-navbar-language').click();
  await page.getByRole('heading', { name: 'Page not found' }).waitFor();
  console.log(JSON.stringify({ routes: report.length, untranslated: report.filter(item => item.untranslated.length), errors }, null, 2));
  assert.deepEqual(report.filter(item => item.untranslated.length), [], 'untranslated authored copy');
  assert.deepEqual(errors, [], 'browser errors');
} finally { await browser.close(); }
