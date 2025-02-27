import request from 'supertest';
import app from '../../server.js';
import mongoose from 'mongoose';

describe('User Authentication', () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect("mongodb+srv://jaiswalshivanivhits:shivani22@cluster0.djusjqb.mongodb.net/Task_test?retryWrites=true&w=majority&appName=Cluster0");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("Debug: Check if server starts", async () => {
        const res = await request(app).get("/");
        console.log("Status:", res.status);
        console.log("Response:", res.text);
        expect(res.status).toBe(200);
    });

    test('Should create a user successfully', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ username: 'giser', email: 'giser@mail.com', password: 'password123' });

        console.log("Status:", res.status);
        console.log("Response:", res.text);

        expect(res.status).toBe(201);
        expect(res.body.user).toHaveProperty('email', 'giser@mail.com');
    });

    test('Should not allow duplicate emails', async () => {
        await request(app)
            .post('/api/user/register')
            .send({ username: 'testuser', email: 'test@mail.com', password: 'password123' });

        const res = await request(app)
            .post('/api/user/register')
            .send({ username: 'testuser2', email: 'test@mail.com', password: 'password123' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Email is already taken.');
    });

    test('Should return JWT on login', async () => {
        await request(app)
            .post('/api/user/register')
            .send({ username: 'loginuser', email: 'login@mail.com', password: 'password123' });

        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'login@mail.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});