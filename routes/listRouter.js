const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

const {
  getLists,
  createList,
  updateList,
  deleteList,
  getListById,
} = require('../controllers/listController');

router.get('/', authenticate, getLists);

router.get('/:id', authenticate, getListById);

router.post('/', authenticate, createList);

router.patch('/:id', authenticate, updateList);

router.delete('/:id', authenticate, deleteList);

module.exports = {
  listRouter: router,
};
