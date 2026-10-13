import request from 'supertest';
import app from '../app.js';
import { scoreAptitudeAttempt, buildCategoryPerformance } from '../services/aptitudeService.js';
import { computeProgressSnapshot } from '../services/roadmapService.js';

let passed = 0;
let failed = 0;
const check = (name, condition) => {
  if (condition) { passed += 1; console.log(`  ✅ PASSED: ${name}`); }
  else { failed += 1; console.error(`  ❌ FAILED: ${name}`); }
};

console.log('\n--- RUNNING PHASE 7–9 LEARNING MODULE TESTS ---');

const question = {
  _id: { toString: () => 'question-1' },
  question: 'What is 2 + 2?', category: 'Quantitative Aptitude', difficulty: 'Easy',
  options: ['3', '4', '5'], correctAnswerIndex: 1, explanation: '2 + 2 equals 4.',
};
const scored = scoreAptitudeAttempt([question], [{ questionId: 'question-1', selectedOption: 1, isCorrect: false, score: 999 }]);
check('Aptitude scoring ignores client-provided score/isCorrect fields', scored.correctAnswers === 1 && scored.scorePercentage === 100 && scored.details[0].isCorrect);
const incorrect = scoreAptitudeAttempt([question], [{ questionId: 'question-1', selectedOption: 0 }]);
check('Aptitude scoring returns explanations and correct answer only after scoring', incorrect.scorePercentage === 0 && incorrect.details[0].correctAnswerIndex === 1);
const performance = buildCategoryPerformance([{ status: 'completed', category: 'Verbal Ability', scorePercentage: 40 }, { status: 'completed', category: 'Verbal Ability', scorePercentage: 80 }]);
check('Aptitude performance aggregates by category', performance.byCategory['Verbal Ability'].averageScore === 60 && performance.weakTopics[0].category === 'Verbal Ability');
const snapshot = computeProgressSnapshot({ profileCompleteness: 100, resumeScore: 80, dsaPercentage: 60, aptitudeAverage: 50, interviewAveragePercent: 70, missingSkills: ['Docker'] });
check('Roadmap readiness is calculated from bounded backend statistics', snapshot.readinessScore === 71 && snapshot.missingSkills[0] === 'Docker');

const unauthenticatedChecks = async () => {
  const dsa = await request(app).get('/api/dsa/questions');
  check('DSA question bank requires authentication', dsa.status === 401);
  const aptitude = await request(app).post('/api/aptitude/start').send({ category: 'Mixed' });
  check('Aptitude tests require authentication', aptitude.status === 401);
  const roadmap = await request(app).post('/api/roadmap/generate');
  check('Roadmap generation requires authentication', roadmap.status === 401);
};

await unauthenticatedChecks();
console.log(`\nTest Results: ${passed} Passed, ${failed} Failed\n`);
if (failed) process.exit(1);
