const {
    createTaskInSystem,
    getTasksInSystem,
    getTaskInSystemById,
    updateTaskInSystemById,
    deleteTaskInSystemById
} = require('../src/controllers');
const TaskManagement = require('../src/models');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

jest.mock('../src/models');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('fakeToken'),
    verify: jest.fn().mockReturnValue({ id: 'testUserId' })
}));

describe('Task Management System Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    // JSON validation function
    const validateResponse = (responseData, expectedStatusCode, expectedResponse) => {
        try {
            expect(res.statusCode).toBe(expectedStatusCode);
            const parsedData = JSON.parse(responseData);
            expect(parsedData).toEqual(expectedResponse);
        } catch (error) {
            console.error('Failed to parse JSON:', responseData, error);
            throw new Error('Failed to parse JSON');
        }
    };

    it('should handle errors during task creation', async () => {
        req.body = { title: 'Invalid Task' };
        TaskManagement.prototype.save = jest.fn().mockRejectedValue(new Error('Failed to save'));

        await createTaskInSystem(req, res, next);

        validateResponse(res._getData(), 400, { message: 'Failed to save' });
    });

    it('should retrieve all tasks successfully', async () => {
        const mockTasks = [{ id: '123', title: 'Test Task', description: 'Test Description', status: 'Pending' }];
        TaskManagement.find = jest.fn().mockResolvedValue(mockTasks);

        await getTasksInSystem(req, res, next);

        validateResponse(res._getData(), 200, mockTasks);
    });

    it('should handle errors during retrieving all tasks', async () => {
        TaskManagement.find = jest.fn().mockRejectedValue(new Error('Failed to retrieve tasks'));

        await getTasksInSystem(req, res, next);

        validateResponse(res._getData(), 500, { message: 'Failed to retrieve tasks' });
    });

    it('should retrieve a task by id successfully', async () => {
        req.params.id = '123';
        const mockTask = { id: '123', title: 'Test Task', description: 'Test Description', status: 'Pending' };
        TaskManagement.findById = jest.fn().mockResolvedValue(mockTask);

        await getTaskInSystemById(req, res, next);

        validateResponse(res._getData(), 200, mockTask);
    });

    it('should handle task not found during retrieval by id', async () => {
        req.params.id = '123';
        TaskManagement.findById = jest.fn().mockResolvedValue(null);

        await getTaskInSystemById(req, res, next);

        validateResponse(res._getData(), 404, { message: 'Task not found' });
    });

    it('should handle errors during retrieval by id', async () => {
        req.params.id = '123';
        TaskManagement.findById = jest.fn().mockRejectedValue(new Error('Failed to retrieve task'));

        await getTaskInSystemById(req, res, next);

        validateResponse(res._getData(), 500, { message: 'Failed to retrieve task' });
    });

    it('should update a task successfully', async () => {
        req.params.id = '123';
        req.body = { title: 'Updated Task' };
        const mockTask = { id: '123', title: 'Updated Task' };
        TaskManagement.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTask);

        await updateTaskInSystemById(req, res, next);
        validateResponse(res._getData(), 200, mockTask);
    });

    it('should handle task not updated during update', async () => {
        req.params.id = '123';
        req.body = { title: 'Updated Task' };
        TaskManagement.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

        await updateTaskInSystemById(req, res, next);

        validateResponse(res._getData(), 404, { message: 'Task not updated' });
    });

    it('should handle errors during task update', async () => {
        req.params.id = '123';
        req.body = { title: 'Updated Task' };
        TaskManagement.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Failed to update task'));

        await updateTaskInSystemById(req, res, next);
        validateResponse(res._getData(), 400, { message: 'Failed to update task' });
    });

    it('should delete a task successfully', async () => {
        req.params.id = '123';
        const mockResponse = { message: 'Task deleted successfully' };
        TaskManagement.findByIdAndDelete = jest.fn().mockResolvedValue({});

        await deleteTaskInSystemById(req, res, next);

        validateResponse(res._getData(), 200, mockResponse);
    });

    it('should handle task not found during delete', async () => {
        req.params.id = '123';
        TaskManagement.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        await deleteTaskInSystemById(req, res, next);

        validateResponse(res._getData(), 404, { message: 'Task not found' });
    });

    it('should handle errors during task deletion', async () => {
        req.params.id = '123';
        TaskManagement.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Failed to delete task'));

        await deleteTaskInSystemById(req, res, next);
        validateResponse(res._getData(), 500, { message: 'Failed to delete task' });
    });
});
