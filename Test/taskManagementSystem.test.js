const request = require('supertest');
const app = require('../src/index'); 
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const generateToken = () => {
    return jwt.sign({ userId: 'testUserId' }, process.env.SECRET, { expiresIn: '1h' });
};

describe('Task Management System', () => {
    let token;
    let createdTaskId;

    beforeAll(async () => {
        token = generateToken(); 
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create a task', async () => {
        const res = await request(app)
            .post('/api/createtask')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'Test Description',
                status: 'Pending'
            });

        console.log('Create Task Response:', res.body);

        if (res.statusCode !== 201) {
            console.error('Error creating task:', res.body);
        }

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');

        const allTasksRes = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve All Tasks Response:', allTasksRes.body); 
        if (allTasksRes.statusCode !== 200) {
            console.error('Error retrieving tasks:', allTasksRes.body);
        }

        expect(allTasksRes.statusCode).toEqual(200);
        expect(Array.isArray(allTasksRes.body)).toBe(true);

        const createdTask = allTasksRes.body.find(task => task.title === 'Test Task');
        if (createdTask) {
            createdTaskId = createdTask._id;
        } else {
            console.error('Created task not found in the list.');
        }
    });

    it('should retrieve all tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve All Tasks Response:', res.body); 
        

        if (res.statusCode !== 200) {
            console.error('Error retrieving tasks:', res.body);
        }

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should retrieve a task by id', async () => {
        if (!createdTaskId) {
            console.error('No task ID found for retrieval.');
            return;
        }

        const res = await request(app)
            .get(`/api/gettask/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve Task By ID Response:', res.body); 

        if (res.statusCode !== 200) {
            console.error('Error retrieving task by id:', res.body);
        }

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', createdTaskId.toString());
    });

    it('should update a task', async () => {
        if (!createdTaskId) {
            console.error('No task ID found for updating.');
            return;
        }

        const res = await request(app)
            .patch(`/api/updatetask/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Task'
            });

        console.log('Update Task Response:', res.body); 

        if (res.statusCode !== 200) {
            console.error('Error updating task:', res.body);
        }

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Updated Task');
    });

    it('should delete a task', async () => {
        if (!createdTaskId) {
            console.error('No task ID found for deletion.');
            return;
        }

        const res = await request(app)
            .delete(`/api/deletetask/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete Task Response:', res.body); 

        if (res.statusCode !== 204) {
            console.error('Error deleting task:', res.body);
        }

        expect(res.statusCode).toEqual(204);
    });
});
