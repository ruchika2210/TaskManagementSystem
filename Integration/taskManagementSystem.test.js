const request = require('supertest');
const app = require('../src/index'); 
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const generateToken = (userId = 'testUserId') => {
    return jwt.sign({ id: userId }, process.env.SECRET, { expiresIn: '3h' });
};

describe('Task Management System', () => {
    let token;
    let createdTaskId;

    beforeAll(async () => {
        // Generate a valid token for authentication
        token = generateToken(); 
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    const validateResponse = (response, expectedResponse, expectedStatusCode) => {
        try {
            const data = response.body;
            if (data === undefined) {
                console.error('Response Data is undefined');
                throw new Error('Response Data is undefined');
            }

            console.log('Response Data:', data);

            expect(response.statusCode).toBe(expectedStatusCode);
            expect(data).toEqual(expectedResponse);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            throw new Error('Failed to parse JSON');
        }
    };

    it('should create a task successfully', async () => {
        const res = await request(app)
            .post('/api/createtask')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'Test Description',
                status: 'Pending'
            });

        console.log('Create Task Response:', res.body);

        validateResponse(res, { ...res.body, _id: expect.any(String) }, 201);

        // Verify the created task can be retrieved
        const allTasksRes = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve All Tasks Response:', allTasksRes.body);

        expect(allTasksRes.statusCode).toEqual(200);
        expect(Array.isArray(allTasksRes.body)).toBe(true);

        const createdTask = allTasksRes.body.find(task => task.title === 'Test Task');
        if (createdTask) {
            createdTaskId = createdTask._id;
        } else {
            console.error('Created task not found in the list.');
        }

        expect(createdTaskId).toBeDefined();
    });

    it('should retrieve all tasks successfully', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve All Tasks Response:', res.body);

        validateResponse(res, res.body, 200);
    });

    it('should retrieve a task by id successfully', async () => {
        if (!createdTaskId) {
            console.error('No task ID found for retrieval.');
            return;
        }

        const res = await request(app)
            .get(`/api/gettask/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Retrieve Task By ID Response:', res.body);

        validateResponse(res, { ...res.body, _id: createdTaskId.toString() }, 200);
    });

    it('should update a task successfully', async () => {
        if (!createdTaskId) {
            console.error('No task ID found for updating.');
            return;
        }

        const res = await request(app)
            .put(`/api/updatetask/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Task'
            });

        console.log('Update Task Response:', res.body);

        validateResponse(res, { ...res.body, title: 'Updated Task' }, 200);
    });

    it('should delete a task successfully', async () => {
        if (!createdTaskId) {
            console.error('No task ID found for deletion.');
            return;
        }

        const res = await request(app)
            .delete(`/api/deletetask/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Delete Task Response:', res.body);

        validateResponse(res, { message: 'Task deleted successfully' }, 200);
    });
});