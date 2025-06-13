const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

describe('Books API', () => {
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
    const books = db.collection('books');
    await books.insertMany([
      { title: 'Test Book 1', author: 'Author 1', isbn: '1111111111' },
      { title: 'Test Book 2', author: 'Author 2', isbn: '2222222222' }
    ]);
  });

  afterEach(async () => {
    await db.collection('books').deleteMany({});
  });

  test('GET /books should return all books', async () => {
    const response = await request(app)
      .get('/books')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('title');
  });

  test('GET /books/:id should return a specific book', async () => {
    const book = await db.collection('books').findOne();
    
    const response = await request(app)
      .get(`/books/${book._id}`)
      .expect(200);

    expect(response.body.title).toBe(book.title);
    expect(response.body.author).toBe(book.author);
  });

  test('GET /books/:id should return 404 for non-existent book', async () => {
    const fakeId = new ObjectId();
    
    await request(app)
      .get(`/books/${fakeId}`)
      .expect(404);
  });
});