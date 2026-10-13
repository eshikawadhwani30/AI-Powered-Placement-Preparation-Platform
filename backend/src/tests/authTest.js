import assert from 'assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize, adminOnly } from '../middleware/roleMiddleware.js';
import User from '../models/userModel.js';

console.log('--- RUNNING PHASE 2 AUTHENTICATION & SECURITY TESTS ---');

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

  // Test 1: express-validator rejects missing registration inputs with 400
  await test('Registration rejects missing name/email/password with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.errors.length > 0);
  });

  // Test 2: express-validator rejects invalid email format
  await test('Registration rejects malformed email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'invalid-email-string',
        password: 'password123',
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('valid email'));
  });

  // Test 3: express-validator rejects password shorter than 6 characters
  await test('Registration rejects password with fewer than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'test@example.com',
        password: '123',
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('6 characters'));
  });

  // Test 4: express-validator rejects empty login credentials with 400
  await test('Login rejects empty payload with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // Test 5: Protected route rejects unauthenticated request with 401
  await test('Protected endpoint (/api/auth/me) returns 401 when no token is supplied', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('No authentication token provided'));
  });

  // Test 6: Protected route rejects forged token with 401
  await test('Protected endpoint returns 401 when forged/tampered token is supplied', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_tampered_token_xyz');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Invalid or malformed'));
  });

  // Test 7: JWT utility signs and embeds user ID and role properly
  await test('generateToken generates valid signed JWT with embedded ID and role', async () => {
    const testSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
    const fakeId = '654321654321654321654321';
    const token = generateToken(null, fakeId, 'admin');
    const decoded = jwt.verify(token, testSecret);
    assert.strictEqual(decoded.id, fakeId);
    assert.strictEqual(decoded.role, 'admin');
  });

  // Test 8: Role authorization middleware blocks non-admin users
  await test('roleMiddleware blocks standard user from admin resource with 403 Forbidden', async () => {
    let statusCode = null;
    let jsonOutput = null;

    const mockReq = {
      user: { role: 'user', name: 'Regular Student' },
    };
    const mockRes = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            jsonOutput = data;
          },
        };
      },
    };
    const mockNext = () => {
      assert.fail('next() should not be called for non-admin');
    };

    adminOnly(mockReq, mockRes, mockNext);
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(jsonOutput.success, false);
    assert.ok(jsonOutput.message.includes('Forbidden'));
  });

  // Test 9: Bcrypt hashing and password comparison
  await test('Bcrypt hashes passwords securely and matches correct plaintexts', async () => {
    const rawPassword = 'StudentSecretKey#2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert.notStrictEqual(rawPassword, hash);
    const matchesCorrect = await bcrypt.compare(rawPassword, hash);
    const matchesWrong = await bcrypt.compare('WrongPassword', hash);

    assert.strictEqual(matchesCorrect, true);
    assert.strictEqual(matchesWrong, false);
  });

  // Test 10: User model toJSON never leaks password hash or internal version key
  await test('User schema toJSON prevents password and __v exposure', () => {
    const mockUser = new User({
      name: 'Safe Student',
      email: 'safe@student.edu',
      password: 'hashed_password_sample',
    });
    const serialized = mockUser.toJSON();
    assert.strictEqual(serialized.password, undefined);
    assert.strictEqual(serialized.__v, undefined);
    assert.strictEqual(serialized.name, 'Safe Student');
    assert.strictEqual(serialized.email, 'safe@student.edu');
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
