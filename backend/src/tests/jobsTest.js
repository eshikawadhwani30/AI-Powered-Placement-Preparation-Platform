import assert from 'assert';
import request from 'supertest';
import app from '../app.js';
import { calculateJobMatches } from '../services/recommendationService.js';

console.log('--- RUNNING PHASE 6 AI JOB RECOMMENDATIONS TESTS ---');

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

  // Test 1: Public job listings endpoint returns 200
  await test('GET /api/jobs returns 200 with paginated structure', async () => {
    const res = await request(app).get('/api/jobs');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(typeof res.body.totalPages === 'number');
    assert.ok(Array.isArray(res.body.data));
  });

  // Test 2: Recommendations require authentication
  await test('POST /api/jobs/recommendations returns 401 when no token is provided', async () => {
    const res = await request(app).post('/api/jobs/recommendations');
    assert.strictEqual(res.status, 401);
  });

  // Test 3: Recommendation algorithm accurately computes skill matches, gaps, and reasons
  await test('calculateJobMatches computes intersection percentages and flags missing skills', () => {
    const mockProfile = {
      skills: ['React', 'Node.js', 'Express', 'MongoDB'],
      preferredJobRoles: ['Full Stack Developer'],
      preferredLocation: 'Bengaluru',
    };

    const mockJobs = [
      {
        _id: 'job-1',
        title: 'Full Stack MERN Developer',
        company: 'Fintech Hub',
        location: 'Bengaluru',
        requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'],
        applicationUrl: 'https://example.com/apply',
      },
      {
        _id: 'job-2',
        title: 'Embedded Firmware Engineer',
        company: 'Hardware Corp',
        location: 'Pune',
        requiredSkills: ['C', 'Assembly', 'RTOS', 'Microcontrollers'],
        applicationUrl: 'https://example.com/apply',
      },
    ];

    const results = calculateJobMatches(mockProfile, mockJobs);

    assert.strictEqual(results.length, 2);
    // Job 1 should rank higher due to 4/6 skill matches plus role and location boost
    assert.strictEqual(results[0]._id, 'job-1');
    assert.ok(results[0].matchScore > results[1].matchScore);
    assert.strictEqual(results[0].matchedSkills.length, 4);
    assert.strictEqual(results[0].missingSkills.length, 2);
    assert.ok(results[0].missingSkills.includes('AWS'));
    assert.ok(results[0].missingSkills.includes('Docker'));
    assert.ok(results[0].reasonWhyMatched.includes('Strong match'));
  });

  // Test 4: Creating job without admin privilege is blocked with 403 Forbidden
  await test('POST /api/jobs rejects regular user with 403 Forbidden', async () => {
    const testSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: '654321654321654321654321', role: 'user' }, testSecret);

    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Unauthorized SDE Listing',
        company: 'Test Company',
        location: 'Remote',
        description: 'Test',
        applicationUrl: 'https://example.com',
      });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Forbidden'));
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
