const request = require('supertest');
const app = require('../src/index'); // Import the app instance
const mongoose = require('mongoose');
const TaskManagement = require('../src/models.js'); // Ensure correct model path

describe('Task Management System', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await TaskManagement.deleteMany({});
    });

    it('should create a task', async () => {
        const res = await request(app).post('/api/createtask').send({
            title: 'Test Task',
            description: 'Test Description',
            status: 'Pending'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('should retrieve all tasks', async () => {
        await TaskManagement.create({ title: 'Test Task', description: 'Test Description', status: 'Pending' });
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });

    it('should retrieve a task by id', async () => {
        const task = await TaskManagement.create({ title: 'Test Task', description: 'Test Description', status: 'Pending' });
        const res = await request(app).get(`/api/gettask/${task._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', task._id.toString());
    });

    it('should update a task', async () => {
        const task = await TaskManagement.create({ title: 'Test Task', description: 'Test Description', status: 'Pending' });
        const res = await request(app).put(`/api/updatetask/${task._id}`).send({
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'In Progress'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Updated Task');
    });

    it('should delete a task', async () => {
        const task = await TaskManagement.create({ title: 'Test Task', description: 'Test Description', status: 'Pending' });
        const res = await request(app).delete(`/api/deletetask/${task._id}`);
        expect(res.statusCode).toEqual(204);
    });
});
