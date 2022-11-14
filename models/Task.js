const mongoose = require('mongoose');

const Statuses = Object.freeze({
  todo: 'todo',
  progress: 'progress',
  done: 'done',
});

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdDate: {
    type: Date,
    default: () => Date.now(),
  },
  archived: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: Object.values(Statuses),
    default: Statuses.todo,
  },
});

const Task = mongoose.model('task', taskSchema);

module.exports = {
  Task,
};
