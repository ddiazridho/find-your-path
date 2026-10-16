import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const browser = await chromium.launch({ channel: process.env.QUIZ_BROWSER_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : undefined), headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await context.newPage();
let analysisRequests = 0;
const analysisPayloads = [];
await page.route('**/quiz/analyze', async route => {
  analysisRequests++;
  const body = route.request().postDataJSON();
  analysisPayloads.push(body.answers);
  const ids = ['q27', 'q28', 'q29', 'q30'].filter(id => typeof body.answers[id] === 'string' && body.answers[id].trim());
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ analysis: { dominantReasoning: 'Skor keenam tipe minat sama tinggi, sehingga belum ada satu tipe yang paling menonjol.', alignment: ids.length ? 'sebagian' : 'tidak_cukup_bukti', reasoning: ids.length ? 'Refleksimu tentang belajar dan membantu teman sejalan dengan beberapa minatmu. Masih ada bidang lain yang bisa kamu coba.' : 'Belum ada esai untuk dibandingkan dengan profil minatmu.', usedQuestionIds: ids, ignoredQuestionIds: [], recommendations: [{ name: 'Desain Komunikasi Visual', primaryRiasec: 'A', studyOverview: 'Mempelajari komunikasi visual, tipografi, dan desain untuk berbagai media.' }, { name: 'Arsitektur', primaryRiasec: 'R', studyOverview: 'Mempelajari perancangan ruang, struktur bangunan, dan lingkungan binaan.' }, { name: 'Psikologi', primaryRiasec: 'S', studyOverview: 'Mempelajari perilaku manusia, proses berpikir, dan metode penelitian.' }] } }) });
});
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('websocket', socket => socket.on('socketerror', error => errors.push(`WebSocket: ${error}`)));
const dialogs = [];
page.on('dialog', d => { dialogs.push(d.message()); void d.dismiss(); });
await mkdir('.impeccable/review', { recursive: true });
const base = process.env.QUIZ_TEST_URL ?? 'http://127.0.0.1:3000';
const sizes = [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1366, height: 900 }];
await writeFile('.impeccable/review/browser-result.json', JSON.stringify({ status: 'running', viewports: sizes }, null, 2));
async function checkSurface(name) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name} horizontal overflow`);
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await window.axe.run(document.querySelector('.quiz-shell'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })));
  assert.deepEqual(violations, [], `${name}: ${JSON.stringify(violations)}`);
}
try {
  await page.goto(`${base}/quiz/results`);
  await page.getByRole('heading', { name: 'Lengkapi asesmenmu dulu' }).waitFor();
  await page.getByRole('link', { name: 'Mulai atau Lanjutkan Asesmen' }).click();
  await page.getByRole('button', { name: 'Mulai Asesmen', exact: true }).waitFor();
  await checkSurface('desktop intro');
  await page.screenshot({ path: '.impeccable/review/desktop-intro.png', fullPage: true });
  await page.getByRole('button', { name: 'Mulai Asesmen', exact: true }).click();
  // Unanswered items may be skipped and are surfaced on submit.
  await page.getByRole('button', { name: 'Selanjutnya' }).click();
  await page.getByRole('radio').nth(3).focus(); await page.keyboard.press('Space');
  assert.equal(await page.getByRole('radio').nth(3).isChecked(), true);
  await page.reload(); await page.getByRole('radio').nth(3).waitFor();
  assert.equal(await page.getByRole('radio').nth(3).isChecked(), true);
  for (const size of sizes) {
    await page.setViewportSize(size); await checkSurface(`rating ${size.width}`);
    if (size.width === 390 || size.width === 1366) await page.screenshot({ path: `.impeccable/review/quiz-${size.width === 390 ? 'mobile' : 'desktop'}.png`, fullPage: true });
    else await page.screenshot({ path: `.impeccable/review/quiz-${size.width}.png`, fullPage: true });
    if (size.width <= 390) {
      await page.screenshot({ path: `.impeccable/review/quiz-${size.width}-top.png`, fullPage: false });
      await page.locator('.rating-card').last().evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      assert.equal(await page.locator('.rating-card').last().evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= document.querySelector('.quiz-navigation').getBoundingClientRect().top;
      }), true, `option five reachable above footer at ${size.width}px`);
      await page.screenshot({ path: `.impeccable/review/quiz-${size.width}-last-option.png`, fullPage: false });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Simpan progres dan kembali ke pengantar' }).click();
  await page.getByRole('button', { name: 'Lanjutkan Asesmen' }).click();
  assert.equal(await page.getByRole('radio').nth(3).isChecked(), true);
  for (let i = 1; i < 30; i++) {
    if (i < 26) await page.getByRole('radio').nth(i < 12 ? 3 : 0).check();
    else if (i !== 29) await page.getByRole('textbox').fill('Saya suka belajar dan membantu teman.');
    if (i === 12) await checkSurface('situational mobile');
    if (i === 18) await checkSurface('reasoning mobile');
    if (i === 26) {
      await page.reload(); await page.getByRole('textbox').waitFor();
      assert.equal(await page.getByRole('textbox').inputValue(), 'Saya suka belajar dan membantu teman.');
      await checkSurface('essay refresh');
    }
    await page.getByRole('button', { name: i === 29 ? 'Submit Asesmen' : 'Selanjutnya' }).click();
  }
  await page.getByRole('alert').filter({ hasText: 'Soal 1 belum dijawab' }).waitFor();
  await page.getByRole('heading', { name: 'Saya tertarik merakit atau memperbaiki perangkat elektronik.' }).waitFor();
  assert.equal(page.url().endsWith('/quiz'), true);
  for (let i = 0; i < 29; i++) {
    if (i === 0) await page.getByRole('radio').nth(3).check();
    await page.getByRole('button', { name: 'Selanjutnya' }).click();
  }
  await page.getByRole('textbox').fill('Saya ingin mempertimbangkan minat dan biaya kuliah.');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: 'Sebelumnya', exact: true }).click();
  await page.getByRole('heading', { name: 'Masalah apa yang ingin kamu bantu selesaikan melalui pendidikan atau kariermu kelak?' }).waitFor();
  assert.equal(await page.evaluate(() => window.scrollY), 0);
  await page.getByRole('button', { name: 'Selanjutnya' }).click();
  assert.equal(await page.getByRole('textbox').inputValue(), 'Saya ingin mempertimbangkan minat dan biaya kuliah.');
  await page.getByRole('button', { name: 'Submit Asesmen', exact: true }).evaluate(button => { button.click(); button.click(); });
  await page.waitForURL('**/quiz/results');
  await page.getByRole('heading', { name: 'Ringkasan Minatmu' }).waitFor();
  await page.getByRole('heading', { name: 'Refleksi esaimu' }).waitFor();
  await page.getByRole('heading', { name: 'Membaca pola minatmu' }).waitFor();
  await page.getByText('Skor keenam tipe minat sama tinggi, sehingga belum ada satu tipe yang paling menonjol.').waitFor();
  await page.getByText('Refleksimu tentang belajar dan membantu teman sejalan dengan beberapa minatmu. Masih ada bidang lain yang bisa kamu coba.').waitFor();
  assert.equal(await page.getByText('Jawaban dihasilkan oleh AI, jawaban yang kurang relevan diabaikan dalam ringkasan.').count(), 1);
  assert.equal(await page.getByText(/jawaban yang belum relevan atau belum jelas tidak dipakai/).count(), 0);
  assert.equal(analysisRequests, 1, JSON.stringify(analysisPayloads));
  // Next Cache Components can retain inactive routes in hidden Activity trees.
  await page.waitForFunction(() => [...document.querySelectorAll('main')].filter(el => el.getClientRects().length > 0).length === 1, null, { timeout: 10000 });
  assert.equal(dialogs.length, 0, 'no submit confirmation');
  await page.getByRole('heading', { name: 'Rekomendasi jurusan' }).waitFor();
  assert.equal(await page.locator('.recommended-major').count(), 3);
  for (const name of ['Desain Komunikasi Visual', 'Arsitektur', 'Psikologi']) await page.locator('.recommendations-section').getByRole('heading', { name }).waitFor();
  assert.equal(await page.locator('.recommendation-copy').getByText('Yang dipelajari').count(), 3);
  await page.getByText('Mempelajari komunikasi visual, tipografi, dan desain untuk berbagai media.').waitFor();
  assert.equal(await page.locator('.recommendations-section').getByRole('link').count(), 0);
  assert.equal(await page.locator('.recommendations-section').getByText(/Coba Simulasi|Lihat Detail|Alasan rekomendasi/).count(), 0);
  assert.equal(await page.locator('.interest-bars [role=meter]').count(), 6);
  assert.equal(await page.locator('table,textarea,details,.review-list,.reflection-answer').count(), 0);
  const content = await page.locator('main.quiz-results').innerText();
  for (const forbidden of ['Penalaran', 'Numerik', 'Logika', 'Verbal', 'Spasial', 'Rumus:', 'Jawaban benar']) assert.equal(content.includes(forbidden), false, `${forbidden} must not appear on results`);
  for (const size of sizes) {
    await page.setViewportSize(size); await checkSurface(`results ${size.width}`);
    if (size.width === 390 || size.width === 1366) await page.screenshot({ path: `.impeccable/review/${size.width === 390 ? 'mobile' : 'desktop'}-results.png`, fullPage: true });
    else await page.screenshot({ path: `.impeccable/review/results-${size.width}.png`, fullPage: true });
  }
  await page.reload(); await page.getByRole('heading', { name: 'Ringkasan Minatmu' }).waitFor();
  assert.equal(analysisRequests, 1, 'cached interpretation survives refresh');
  assert.equal(await page.locator('.recommended-major').count(), 3);
  await page.goto(`${base}/quiz`);
  await page.waitForURL('**/quiz/results');
  await page.getByRole('heading', { name: 'Ringkasan Minatmu' }).waitFor();
  // Retake immediately resets the assessment without a browser confirmation.
  await page.getByRole('button', { name: 'Ulangi Kuis' }).click();
  await page.waitForURL('**/quiz');
  assert.equal(dialogs.length, 0, 'no retake confirmation');
  assert.equal(await page.evaluate(() => localStorage.getItem('find-your-path:quiz:v4')), null);
  await page.getByRole('button', { name: 'Mulai Asesmen', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Mulai Asesmen', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Selanjutnya' }).isEnabled(), true, 'retake resets preserved busy state');
  await page.getByRole('radio').nth(3).check();
  await page.getByRole('button', { name: 'Selanjutnya' }).click();
  await page.getByRole('heading', { name: 'Saya senang melakukan eksperimen untuk memahami cara kerja sesuatu.' }).waitFor();
  await page.reload();
  await page.getByRole('heading', { name: 'Saya senang melakukan eksperimen untuk memahami cara kerja sesuatu.' }).waitFor();
  await page.evaluate(() => {
    localStorage.removeItem('find-your-path:quiz:v4');
    const answers = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`q${i + 1}`, i < 12 ? ([0,11].includes(i) ? 5 : 1) : i < 26 ? 'A' : 4]));
    localStorage.setItem('find-your-path:quiz:v3', JSON.stringify({ version: 3, phase: 'complete', index: 29, answers }));
  });
  await page.reload();
  await page.waitForURL('**/quiz/results');
  await page.getByText('Belum cukup bahan').waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('find-your-path:quiz:v3')), null);
  assert.equal(await page.evaluate(() => localStorage.getItem('find-your-path:quiz:v4').includes('old private essay')), false);
  await page.locator('main.quiz-results').getByText('Skor keenam tipe minat sama tinggi, sehingga belum ada satu tipe yang paling menonjol.', { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await checkSurface('dominant profile');
  await page.screenshot({ path: '.impeccable/review/dominant-mobile-results.png', fullPage: true });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(base); await page.getByRole('link', { name: 'Know your path' }).waitFor();
  await page.goto(`${base}/computer-science/software`); await page.getByText('Software Track Interactive Room', { exact: true }).waitFor();
  const unavailable = await browser.newContext();
  await unavailable.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage disabled', 'SecurityError'); } }); });
  const blockedPage = await unavailable.newPage();
  await blockedPage.goto(`${base}/quiz`);
  await blockedPage.getByRole('status').filter({ hasText: 'Penyimpanan perangkat tidak tersedia' }).waitFor();
  await blockedPage.getByRole('button', { name: 'Mulai Asesmen', exact: true }).click();
  await blockedPage.getByRole('radio').first().check();
  await blockedPage.getByRole('button', { name: 'Selanjutnya' }).click();
  await blockedPage.getByRole('heading', { name: 'Saya senang melakukan eksperimen untuk memahami cara kerja sesuatu.' }).waitFor();
  await unavailable.close();
  assert.deepEqual(errors, []);
  console.log('PASS: 30 questions, skip/missing validation, direct double-click submit, concise results, refresh, reset, migration, blocked storage, keyboard, axe + 320/390/768/1366px, legacy route smoke.');
  await writeFile('.impeccable/review/browser-result.json', JSON.stringify({ status: 'passed', errors, viewports: sizes, flow: 'intro -> 30 questions -> submit -> RIASEC and majors' }, null, 2));
} catch (error) {
  await writeFile('.impeccable/review/browser-result.json', JSON.stringify({ status: 'failed', message: error.message }, null, 2));
  throw error;
} finally { await browser.close(); }
