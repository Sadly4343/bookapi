const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

describe('Stores API', () => {
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
    const stores = db.collection('stores');
    await stores.insertMany([
      { name: 'Test Store 1', location: 'City 1', manager: 'Manager 1' },
      { name: 'Test Store 2', location: 'City 2', manager: 'Manager 2' }
    ]);
  });

  afterEach(async () => {
    await db.collection('stores').deleteMany({});
  });

  test('GET /store should return all stores', async () => {
    const response = await request(app)
      .get('/store') 
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true); 
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('name');
  });

  test('GET /store/:id should return a specific store', async () => {
    const store = await db.collection('stores').findOne();
    
    const response = await request(app)
      .get(`/store/${store._id}`) 
      .expect(200);

    expect(response.body.name).toBe(store.name);
    expect(response.body.location).toBe(store.location);
  });

  test('GET /store/:id should return 404 for non-existent store', async () => {
    const fakeId = new ObjectId();
    
    await request(app)
      .get(`/store/${fakeId}`) 
      .expect(404);
  });
});