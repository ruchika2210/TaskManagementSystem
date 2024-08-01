const express = require('express');
const router = express.Router();
const { createTaskInSystem, getTasksInSystem, getTaskInSystemById, updateTaskInSystemById, deleteTaskInSystemById } = require('./controllers');
const { signup, login } = require('./auth');
const { authenticate } = require('./middleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/createtask', authenticate, createTaskInSystem);
router.get('/tasks', authenticate, getTasksInSystem);
router.get('/gettask/:id', authenticate, getTaskInSystemById);
router.put('/updatetask/:id', authenticate, updateTaskInSystemById);
router.delete('/deletetask/:id', authenticate, deleteTaskInSystemById);

module.exports = router;
