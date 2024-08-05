const mongoose = require('mongoose');
const TaskManagement = require('./models');

exports.createTaskInSystem = async (req, res) => {
    try {
        const task = new TaskManagement(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasksInSystem = async (req, res) => {
    try {
        const tasks = await TaskManagement.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTaskInSystemById = async (req, res) => {
    try {
        const id = req.params.id.trim(); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const task = await TaskManagement.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTaskInSystemById = async (req, res) => {
    try {
        const id = req.params.id.trim(); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const task = await TaskManagement.findByIdAndUpdate(id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not updated' });
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTaskInSystemById = async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const task = await TaskManagement.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
