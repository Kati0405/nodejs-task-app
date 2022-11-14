const express = require('express');

const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');

const {
  getTasksOfList,
  createTaskInList,
  updateTask,
  deleteTask,
  getTaskById,
} = require('../controllers/taskController');

router.get('/:listId/tasks', authenticate, getTasksOfList);

//router.get('/:listId/tasks/', getTasksOfListByStatus);

router.post('/:listId/tasks', authenticate, createTaskInList);

router.patch('/:listId/tasks/:taskId', authenticate, updateTask);

router.delete('/:listId/tasks/:taskId', authenticate, deleteTask);

router.get('/:listId/tasks/:taskId', authenticate, getTaskById);

module.exports = {
  taskRouter: router,
};
