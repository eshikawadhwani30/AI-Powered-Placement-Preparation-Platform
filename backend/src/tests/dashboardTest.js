import assert from 'assert';
import request from 'supertest';
import app from '../app.js';
import { generateToken } from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import { getDashboardData } from '../controllers/dashboardController.js';

console.log('--- RUNNING PHASE 3 DASHBOARD API TESTS ---');

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

  // Test 1: Unauthenticated request to /api/dashboard is blocked with 401
  await test('GET /api/dashboard returns 401 when no token is supplied', async () => {
    const res = await request(app).get('/api/dashboard');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // Test 2: Unauthenticated request with invalid token returns 401
  await test('GET /api/dashboard returns 401 when invalid token is supplied', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', 'Bearer fake_invalid_jwt_token');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  // Test 3: Dashboard data shape and calculations unit check
  await test('Dashboard controller accurately computes readiness and structure', async () => {
    // Mock authenticated user
    const mockUser = {
      _id: '654321654321654321654321',
      name: 'Aditi Sharma',
      email: 'aditi@college.edu',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      preferredJobRoles: ['Full Stack Developer'],
      preferredLocation: 'Bengaluru',
      profile: { college: 'IIT Bombay', graduationYear: 2026 },
      createdAt: new Date(),
    };

    let responsePayload = null;
    let statusCode = null;

    const mockReq = {
      user: mockUser,
    };
    const mockRes = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responsePayload = data;
          },
        };
      },
    };
    const mockNext = (err) => {
      if (err) throw err;
    };

    // Temporarily mock User.findById to return mockUser for unit validation
    const origFindById = User.findById;
    User.findById = () => ({
      select: () => Promise.resolve(mockUser),
    });

    try {
      await getDashboardData(mockReq, mockRes, mockNext);

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(responsePayload.success, true);
      assert.ok(responsePayload.data);

      const d = responsePayload.data;
      // Assert all required sections are present
      assert.ok(d.user);
      assert.strictEqual(d.user.name, 'Aditi Sharma');
      assert.ok(typeof d.user.profileCompleteness === 'number');
      assert.ok(d.readiness);
      assert.ok(d.readiness.score >= 0 && d.readiness.score <= 100);
      assert.ok(d.resume);
      assert.ok(d.dsa);
      assert.ok(d.aptitude);
      assert.ok(d.interview);
      assert.ok(Array.isArray(d.jobs));
      assert.ok(d.roadmap);
      assert.ok(Array.isArray(d.activities));
    } finally {
      User.findById = origFindById;
    }
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
