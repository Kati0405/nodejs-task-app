const express = require('express');

const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');

const {
  getCommentsToTask,
  addCommentToTask,
  deleteCommentToTask,
} = require('../controllers/commentController');

router.get('/:listId/tasks/:taskId/comments', authenticate, getCommentsToTask);

router.post('/:listId/tasks/:taskId/comments', authenticate, addCommentToTask);

router.delete(
  '/:listId/tasks/:taskId/comments/:id',
  authenticate,
  deleteCommentToTask,
);

module.exports = {
  commentRouter: router,
};
