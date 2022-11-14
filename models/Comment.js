const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  _taskId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  author: { type: String },
  time: { type: Date, default: () => Date.now() },
  message: { type: String, required: true },
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = {
  Comment,
};
