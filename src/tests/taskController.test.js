// import request from 'supertest';
// import app from '../../server.js';
// import mongoose from 'mongoose';
// import { User } from '../models/user.js';
// import { Task } from '../models/task.js';

// describe('Task Management', () => {
//     let token;
//     let userId;

//     // beforeEach(async () => {
//     //     await Task.deleteMany({}); // Only delete tasks, not users
//     // });

//     beforeAll(async () => {
//         await mongoose.disconnect();
//         await mongoose.connect("mongodb+srv://jaiswalshivanivhits:shivani22@cluster0.djusjqb.mongodb.net/Task_test?retryWrites=true&w=majority&appName=Cluster0");

//         const userRes = await request(app)
//             .post('/api/user/register')
//             .send({ username: 'g4g', email: 'g4g@mail.com', password: 'password123' });

//         console.log("User creation response:", userRes.body);

//         expect(userRes.status).toBe(201);

//         userId = userRes.body?.user?._id;
//         expect(userId).toBeDefined();

//         const loginRes = await request(app)
//             .post('/api/user/login')
//             .send({ email: 'g4g@mail.com', password: 'password123' });

//         console.log("User login response:", loginRes.body);

//         token = loginRes.body.token;
//         expect(token).toBeDefined();
//     });

//     afterAll(async () => {
//         await mongoose.connection.close();
//     });

//     test('Should create a task successfully', async () => {
//         console.log("Token before task creation:", token);

//         const res = await request(app)
//             .post('/api/task/task')
//             .set('Authorization', `Bearer ${token}`)
//             .send({ title: 'Test Task', description: 'Testing task creation', assignedTo: userId });

//         console.log("Task creation response:", res.body);

//         expect(res.status).toBe(201);
//         expect(res.body.task).toHaveProperty('title', 'Test Task');
//     });

//     test('Should not allow unauthorized task creation', async () => {
//         const res = await request(app)
//             .post('/api/task/task')
//             .send({ title: 'Unauthorized Task', description: 'No auth' });

//         console.log("Unauthorized task creation response:", res.body);

//         expect([401, 403]).toContain(res.status);
//         // expect(res.status).toBe(401);
//     });

//     test('Should update task status', async () => {
//         const taskRes = await request(app)
//             .post('/api/task/task')
//             .set('Authorization', `Bearer ${token}`)
//             .send({ title: 'Update Task', description: 'Testing update', assignedTo: userId });

//         expect(taskRes.status).toBe(201);

//         const taskId = taskRes.body.task._id;
//         expect(taskId).toBeDefined();

//         const updateRes = await request(app)
//             .put(`/api/task/tasks/${taskId}/status`)
//             .set('Authorization', `Bearer ${token}`)
//             .send({ status: 'completed' });

//         console.log("Task update response:", updateRes.body);

//         expect(updateRes.status).toBe(200);
//         expect(updateRes.body.task.status).toBe('completed');
//     });
// });

import request from 'supertest';
import app from '../../server.js';
import mongoose from 'mongoose';
import { User } from '../models/user.js';
import { Task } from '../models/task.js';

describe('Task Management', () => {
    let token;
    let userId;
    let randomEmail;

    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(process.env.MONGO_TEST_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        randomEmail = `task${Date.now()}@mail.com`;
        const userRes = await request(app)
            .post('/api/user/register')
            .send({ username: 'g4g', email: randomEmail, password: 'password123' });

        console.log("User creation response:", userRes.status, userRes.body);

        if (userRes.status !== 201) {
            throw new Error(`User creation failed: ${JSON.stringify(userRes.body)}`);
        }

        userId = userRes.body?.user?._id;
        expect(userId).toBeDefined();

        const loginRes = await request(app)
            .post('/api/user/login')
            .send({ email: randomEmail, password: 'password123' });

        console.log("User login response:", loginRes.status, loginRes.body);

        if (loginRes.status !== 200) {
            throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
        }

        token = loginRes.body.token;
        expect(token).toBeDefined();
    });

    beforeEach(async () => {
        await Task.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Task.deleteMany({});
        await mongoose.connection.close();
    });

    test('Should create a task successfully', async () => {
        console.log("Token before task creation:", token);

        const res = await request(app)
            .post('/api/task/task')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Task', description: 'Testing task creation', assignedTo: userId });

        console.log("Task creation response:", res.status, res.body);

        expect(res.status).toBe(201);
        expect(res.body.task).toHaveProperty('title', 'Test Task');
    });

    test('Should not allow unauthorized task creation', async () => {
        const res = await request(app)
            .post('/api/task/task')
            .send({ title: 'Unauthorized Task', description: 'No auth' });

        console.log("Unauthorized task creation response:", res.status, res.body);

        expect([401, 403]).toContain(res.status);
    });

    test('Should update task status', async () => {
        const taskRes = await request(app)
            .post('/api/task/task')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Update Task', description: 'Testing update', assignedTo: userId });

        expect(taskRes.status).toBe(201);

        const taskId = taskRes.body.task._id;
        expect(taskId).toBeDefined();

        const updateRes = await request(app)
            .put(`/api/task/tasks/${taskId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed' });

        console.log("Task update response:", updateRes.status, updateRes.body);

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.task.status).toBe('completed');
    });
});
