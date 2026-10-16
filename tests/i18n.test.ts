import test from 'node:test';
import assert from 'node:assert/strict';
import { translateText, translateContent } from '../app/i18n/translate';
import { criminalStory } from '../app/law/story-data/criminal';
import { civilStory } from '../app/law/story-data/civil';
import { businessStory } from '../app/law/story-data/business';
import { constitutionalStory } from '../app/law/story-data/constitutional';
import { lessons } from '../app/computer-science/lessons';
import { questions } from '../app/quiz/questions';
import { translateEssayAnalysis, isEssayAnalysis } from '../app/quiz/essay-analysis';
import type { EssayAnalysis } from '../app/quiz/types';

test('preserves formatting, interpolates dynamic messages, and translates nested labels', () => {
  assert.equal(translateText(' Search majors or skills ', 'id'), ' Cari jurusan atau keterampilan ');
  assert.equal(translateText('Step 2 of 5', 'id'), 'Langkah 2 dari 5');
  assert.equal(translateText('Request failed: Two devices have the same IP address. Give every device a unique address.', 'id'), 'Permintaan gagal: Dua perangkat memiliki alamat IP yang sama. Beri setiap perangkat alamat yang berbeda.');
  assert.equal(translateText('THE BIG MORNING', 'id'), 'PAGI YANG MENENTUKAN');
  assert.equal(translateText('Network simulator ready.\nAdd cables and configure IP addresses to begin.', 'id'), 'Simulator jaringan siap.\nTambahkan kabel dan atur alamat IP untuk memulai.');
});

test('does not alter canonical IDs, code, numbers, or React elements', () => {
  const element = { type: 'span', props: { children: 'Continue' } };
  assert.equal(translateContent(element, 'id'), element);
  assert.equal(translateContent(42, 'id'), 42);
  for (const value of ['q13', '192.168.1.10', '<h1>Hello World</h1>', 'SELECT * FROM users;', 'constructor', 'toString', '__proto__']) assert.equal(translateText(value, 'id'), value);
  assert.deepEqual(translateContent(['Continue', 'Back'], 'id'), ['Lanjutkan', 'Kembali']);
});

test('AI translation preserves alignment, evidence IDs, recommendation order and RIASEC codes', async () => {
  const source: EssayAnalysis = {
    dominantReasoning: 'Kamu tertarik pada kegiatan kreatif.', alignment: 'tidak_cukup_bukti', reasoning: 'Belum ada esai untuk dibandingkan.', usedQuestionIds: [], ignoredQuestionIds: [],
    recommendations: ['Desain Komunikasi Visual', 'Arsitektur', 'Seni Rupa'].map(name => ({ name, primaryRiasec: 'A', studyOverview: 'Mempelajari perancangan dan karya kreatif melalui praktik.' })),
  };
  const oldKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  try {
    const result = await translateEssayAnalysis(source, 'en', async (_input, init) => {
      const request = JSON.parse(init?.body as string);
      assert.match(request.instructions, /Jangan menghitung ulang/);
      assert.deepEqual(JSON.parse(request.input).recommendations.map((item: { name: string }) => item.name), source.recommendations.map(item => item.name));
      return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({
        dominantReasoning: 'You are interested in creative activities.', reasoning: 'There are no essays to compare yet.',
        recommendations: ['Visual Communication Design', 'Architecture', 'Fine Arts'].map(name => ({ name, studyOverview: 'Study design and creative work through practical projects.' })),
      }) }] }] });
    });
    assert.equal(isEssayAnalysis(result, {}), true);
    assert.equal(result.alignment, source.alignment);
    assert.deepEqual(result.usedQuestionIds, source.usedQuestionIds);
    assert.deepEqual(result.recommendations.map(item => item.primaryRiasec), ['A', 'A', 'A']);
    assert.deepEqual(result.recommendations.map(item => item.name), ['Visual Communication Design', 'Architecture', 'Fine Arts']);
  } finally {
    if (oldKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = oldKey;
  }
});

test('all legal branches, choices, summaries and learning points have Indonesian translations', () => {
  for (const story of [criminalStory, civilStory, businessStory, constitutionalStory]) {
    for (const scene of Object.values(story.scenes)) {
      for (const text of [scene.dialogue, scene.narration, ...(scene.choices ?? []).flatMap(choice => [choice.label, choice.hint]), ...(scene.ending ? [scene.ending.title, scene.ending.outcome, ...scene.ending.concepts] : [])].filter((value): value is string => typeof value === 'string')) {
        assert.notEqual(translateText(text, 'id'), text, text);
      }
    }
  }
});

test('all lessons and all 30 assessment questions are localized', () => {
  for (const lesson of Object.values(lessons)) {
    for (const text of [...lesson.dialogue, ...lesson.steps.flatMap(step => [step.title, step.instruction, step.hint])]) assert.notEqual(translateText(text, 'id'), text, text);
  }
  for (const question of questions) {
    assert.notEqual(translateText(question.title, 'en'), question.title, question.id);
    if ('options' in question) for (const option of question.options) {
      if (/\p{L}/u.test(option.label) && !/^Rp[\d.]+$/.test(option.label)) assert.notEqual(translateText(option.label, 'en'), option.label, option.label);
    }
  }
});
