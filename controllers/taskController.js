const { List } = require('../models/List');
const { Task } = require('../models/Task');

const getTasksOfList = async (req, res) => {
  let query = req.query;
  await Task.find({
    _listId: req.params.listId,
    ...query,
  }).then((tasks) => {
    res.send(tasks);
  });
};

// const getTasksOfListByStatus = async (req, res) => {
//   await Task.find({
//     _listId: req.params.listId,
//     status: req.query.status,
//   }).then((tasks) => {
//     res.send(tasks);
//   });
// };

const createTaskInList = async (req, res) => {
  await List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      }
      return false;
    })
    .then((canCreateTask) => {
      if (canCreateTask) {
        let newTask = new Task({
          title: req.body.title,
          _listId: req.params.listId,
        });
        newTask.save().then((newTaskDoc) => {
          res.send(newTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
};

const updateTask = async (req, res) => {
  Task.findOne({
    _id: req.params.taskId,
    _listId: req.params.listId,
  })
    .then((list) => {
      if (list) {
        return true;
      }
      return false;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        Task.findByIdAndUpdate(
          {
            _id: req.params.taskId,
            _listId: req.params.listId,
          },
          {
            $set: req.body,
          },
        ).then(() => {
          res.send({ message: 'Updated sucessfully' });
        });
      } else {
        res.sendStatus(404);
      }
    });
};

const deleteTask = async (req, res) => {
  Task.findOne({
    _id: req.params.taskId,
    _listId: req.params.listId,
  })
    .then((list) => {
      if (list) {
        return true;
      }
      return false;
    })
    .then((canDeleteTasks) => {
      if (canDeleteTasks) {
        Task.findByIdAndRemove({
          _id: req.params.taskId,
          _listId: req.params.listId,
        }).then((deletedTaskDoc) => {
          res.send(deletedTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
};

const getTaskById = async (req, res) => {
  await Task.findOne({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((taskDoc) => {
    res.send(taskDoc);
  });
};

module.exports = {
  getTasksOfList,
  createTaskInList,
  updateTask,
  deleteTask,
  getTaskById,
};
