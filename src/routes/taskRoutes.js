import express from 'express';
import { createTask, createTaskWithUserAssignment, deleteTask, getAllTasks, getTasksByUser, updateTaskStatus } from '../controllers/taskController.js';
import { isAdmin } from '../middilware/rolemiddilware.js';
import { authenticate } from '../middilware/authMiddilware.js';

const taskRouter = express.Router();

taskRouter.post('/tasks', authenticate, isAdmin, createTaskWithUserAssignment);
taskRouter.post('/task', authenticate, createTask);
taskRouter.get('/tasks/:userId', authenticate, getTasksByUser);
taskRouter.get('/tasks', authenticate, isAdmin, getAllTasks);
taskRouter.put('/tasks/:taskId/status', authenticate, updateTaskStatus);
taskRouter.delete('/tasks/:taskId', authenticate, deleteTask);

export default taskRouter;
