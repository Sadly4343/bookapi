const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

describe('Users API', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__);
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    const users = db.collection('users');
    await users.insertMany([
      { username: 'testuser1', email: 'user1@test.com', role: 'admin' },
      { username: 'testuser2', email: 'user2@test.com', role: 'user' }
    ]);
  });

  afterEach(async () => {
    await db.collection('users').deleteMany({});
  });

  // Helper function to create authenticated session
  const getAuthenticatedAgent = async () => {
    const agent = request.agent(app);
    
    // Set up session with mock user data
    await agent
      .post('/test-login')
      .send({ mockUser: { displayName: 'Test User' } });

    return agent;
  };

  test('GET /users should return all users', async () => {
    const agent = await getAuthenticatedAgent();
    const response = await agent
      .get('/users')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true); 
    expect(response.body[0]).toHaveProperty('username');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('role');
    expect(response.body[0]).not.toHaveProperty('password');
  });

  test('GET /users/:id should return a specific user', async () => {
    const agent = await getAuthenticatedAgent();
    const user = await db.collection('users').findOne();
    
    const response = await agent
      .get(`/users/${user._id}`)
      .expect(200);

    expect(response.body.username).toBe(user.username);
    expect(response.body.email).toBe(user.email);
    expect(response.body.role).toBe(user.role);
    expect(response.body).not.toHaveProperty('password');
  });

  test('GET /users/:id should return 404 for non-existent user', async () => {
    const agent = await getAuthenticatedAgent();
    const fakeId = new ObjectId();
    
    await agent
      .get(`/users/${fakeId}`)
      .expect(404);
  });

  // Test unauthenticated access
  test('GET /users should return 401 without authentication', async () => {
    await request(app)
      .get('/users')
      .expect(401);
  });

  test('GET /users/:id should return 401 without authentication', async () => {
    const user = await db.collection('users').findOne();
    
    await request(app)
      .get(`/users/${user._id}`)
      .expect(401);
  });
});