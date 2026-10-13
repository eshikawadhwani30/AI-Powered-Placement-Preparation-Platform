import assert from 'assert';
import request from 'supertest';
import app from '../app.js';
import { analyzeResume } from '../services/resumeService.js';

console.log('--- RUNNING PHASE 4 RESUME ANALYZER TESTS ---');

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

  // Test 1: Upload endpoint requires authentication
  await test('POST /api/resume/analyze returns 401 when no token is provided', async () => {
    const res = await request(app).post('/api/resume/analyze');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // Test 2: Upload endpoint rejects requests with no file
  await test('POST /api/resume/analyze rejects missing file with 400 Bad Request', async () => {
    // Generate valid test JWT
    const testSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: '654321654321654321654321', role: 'user' }, testSecret);

    const res = await request(app)
      .post('/api/resume/analyze')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // Test 3: Resume history requires authentication
  await test('GET /api/resume/history returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/resume/history');
    assert.strictEqual(res.status, 401);
  });

  // Test 4: Resume analysis service generates complete structured evaluation
  await test('analyzeResume generates structured analysis with bounded scores and required sections', async () => {
    const sampleResumeText = `
      John Doe
      Education: B.Tech Computer Science, 2026.
      Technical Skills: JavaScript, React, Node.js, Express, MongoDB, Git.
      Projects:
      - E-Commerce Web App: Developed using React and Express with user authentication and payment checkout.
      - Portfolio Website: Designed using HTML, CSS, Tailwind CSS.
    `;
    const targetJD = 'Looking for SDE-1 with React, Node.js, MongoDB, Docker, AWS, and Unit Testing.';

    const result = await analyzeResume(sampleResumeText, targetJD);

    assert.ok(result);
    assert.strictEqual(typeof result.overallScore, 'number');
    assert.ok(result.overallScore >= 0 && result.overallScore <= 100);
    assert.ok(result.summary && typeof result.summary === 'string');
    assert.ok(Array.isArray(result.skillsIdentified));
    assert.ok(Array.isArray(result.missingSkills));
    assert.ok(Array.isArray(result.strengths));
    assert.ok(Array.isArray(result.weaknesses));
    assert.ok(Array.isArray(result.bulletPointSuggestions));
    assert.ok(Array.isArray(result.missingKeywords));
    assert.ok(Array.isArray(result.atsSuggestions));
    assert.ok(Array.isArray(result.learningRoadmap));
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
