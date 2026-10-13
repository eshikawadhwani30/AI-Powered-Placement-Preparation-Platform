import assert from 'assert';
import request from 'supertest';
import app from '../app.js';
import { generateQuestions, evaluateAnswer } from '../services/interviewService.js';

console.log('--- RUNNING PHASE 5 AI INTERVIEW PREPARATION TESTS ---');

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  };

  // Test 1: Generate interview requires authentication
  await test('POST /api/interview/generate returns 401 when no token is provided', async () => {
    const res = await request(app).post('/api/interview/generate').send({
      category: 'Technical',
    });
    assert.strictEqual(res.status, 401);
  });

  // Test 2: Generate rejects invalid category with 400
  await test('POST /api/interview/generate rejects invalid category with 400', async () => {
    const testSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: '654321654321654321654321', role: 'user' }, testSecret);

    const res = await request(app)
      .post('/api/interview/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        jobRole: 'SDE-1',
        category: 'InvalidNonExistentCategory',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // Test 3: Generate creates questions successfully with valid token
  await test('POST /api/interview/generate produces valid question set', async () => {
    const testSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: '654321654321654321654321', role: 'user' }, testSecret);

    const res = await request(app)
      .post('/api/interview/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        jobRole: 'Full Stack Engineer',
        category: 'Technical',
        difficulty: 'Intermediate',
        questionCount: 2,
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.questions.length > 0);
  });

  // Test 4: Evaluate answer service generates rubric score and actionable feedback
  await test('evaluateAnswer returns structured rubric critique and model answer', async () => {
    const question = 'Explain how indexing improves read performance in a MongoDB database.';
    const answer =
      'Indexes in MongoDB create B-Tree data structures that hold a small portion of the dataset in an easy-to-traverse form. Without an index, MongoDB must perform a collection scan (COLLSCAN) inspecting every single document in O(N) time. With an index, it performs an index scan (IXSCAN) in O(log N) time, drastically reducing disk I/O at the cost of slight write overhead.';

    const evaluation = await evaluateAnswer(question, answer, 'Backend Engineer', 'DBMS');

    assert.ok(evaluation);
    assert.strictEqual(typeof evaluation.rubricScore, 'number');
    assert.ok(evaluation.rubricScore >= 0 && evaluation.rubricScore <= 10);
    assert.ok(evaluation.relevance && typeof evaluation.relevance === 'string');
    assert.ok(evaluation.technicalCorrectness && typeof evaluation.technicalCorrectness === 'string');
    assert.ok(Array.isArray(evaluation.missingConcepts));
    assert.ok(Array.isArray(evaluation.areasForImprovement));
    assert.ok(evaluation.suggestedBetterAnswer && typeof evaluation.suggestedBetterAnswer === 'string');
  });

  // Test 5: Interview evaluate requires sessionId and questionId
  await test('POST /api/interview/evaluate validates presence of session and question IDs', async () => {
    const testSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: '654321654321654321654321', role: 'user' }, testSecret);

    const res = await request(app)
      .post('/api/interview/evaluate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userAnswer: 'Short answer',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
