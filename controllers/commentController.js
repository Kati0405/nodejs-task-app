const { Task } = require('../models/Task');
const { Comment } = require('../models/Comment');

const getCommentsToTask = async (req, res) => {
  await Comment.find({
    _taskId: req.params.taskId,
  }).then((comments) => {
    res.send(comments);
  });
};

const addCommentToTask = async (req, res) => {
  await Task.findOne({
    _id: req.params.taskId,
  })
    .then((task) => {
      if (task) {
        return true;
      }
      return false;
    })
    .then((canComment) => {
      if (canComment) {
        let newComment = new Comment({
          message: req.body.message,
          _taskId: req.params.taskId,
        });
        newComment.save().then((newCommentDoc) => {
          res.send(newCommentDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
};

const deleteCommentToTask = async (req, res) => {
  await Comment.findByIdAndRemove({
    _id: req.params.id,
  }).then((removedCommentDoc) => {
    res.send(removedCommentDoc);
  });
};

module.exports = {
  addCommentToTask,
  getCommentsToTask,
  deleteCommentToTask,
};
