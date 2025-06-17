const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

describe('Authors API', () => {
  let connection;
  let db;
  let testAuthor1Id;
  let testAuthor2Id;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__);
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    testAuthor1Id = new ObjectId();
    testAuthor2Id = new ObjectId();

    const authors = db.collection('authors');
    await authors.insertMany([
      { 
        _id: testAuthor1Id, 
        firstName: 'Test', 
        lastName: 'Author 1', 
        biography: 'Test biography 1',
        birthdate: new Date('1990-01-01')
      },
      { 
        _id: testAuthor2Id, 
        firstName: 'Test', 
        lastName: 'Author 2', 
        biography: 'Test biography 2',
        birthdate: new Date('1985-05-15')
      }
    ]);
  });

  afterEach(async () => {
    await db.collection('authors').deleteMany({});
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

  test('GET /authors should return all authors', async () => {
    const agent = await getAuthenticatedAgent();
    const response = await agent
      .get('/authors')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('firstName');
    expect(response.body[0]).toHaveProperty('lastName');
  });

  test('GET /authors/:id should return a specific author', async () => {
    const agent = await getAuthenticatedAgent();
    const response = await agent
      .get(`/authors/${testAuthor1Id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Test');
    expect(response.body.lastName).toBe('Author 1');
    expect(response.body.biography).toBe('Test biography 1');
  });

  test('GET /authors/:id should return 404 for non-existent author', async () => {
    const agent = await getAuthenticatedAgent();
    const fakeId = new ObjectId(); // Generate a valid but non-existent ObjectId
    await agent
      .get(`/authors/${fakeId}`)
      .expect(404);
  });

  test('GET /authors/:id should return 400 for invalid ObjectId format', async () => {
    const agent = await getAuthenticatedAgent();
    await agent
      .get('/authors/invalid-id')
      .expect(400);
  });

  // Test unauthenticated access
  test('GET /authors should return 401 without authentication', async () => {
    await request(app)
      .get('/authors')
      .expect(401);
  });

  test('GET /authors/:id should return 401 without authentication', async () => {
    await request(app)
      .get(`/authors/${testAuthor1Id}`)
      .expect(401);
  });
});