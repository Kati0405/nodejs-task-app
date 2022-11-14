const { List } = require('../models/List');
const { Task } = require('../models/Task');

const getLists = async (req, res) => {
  await List.find({
    _userId: req.user_id,
  }).then((lists) => {
    res.send(lists);
  });
};

const getListById = async (req, res) => {
  await List.findOne({
    _id: req.params.id,
  }).then((listDoc) => {
    res.send(listDoc);
  });
};

const createList = async (req, res) => {
  let _userId = req.user_id;
  let title = req.body.title;
  let description = req.body.description;
  let newList = new List({
    _userId,
    title,
    description,
  });

  await newList.save().then((listDoc) => {
    res.send(listDoc);
  });
};

const updateList = async (req, res) => {
  await List.findByIdAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    },
  ).then(() => {
    res.send({ message: 'Updated successfully' });
  });
};

const deleteList = async (req, res) => {
  await List.findByIdAndRemove({
    _id: req.params.id,
    _userId: req.user_id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);
    deleteTasksFromList(removedListDoc._id);
  });
};

/*HELPER*/
let deleteTasksFromList = (_listId) => {
  Task.deleteMany({
    _listId,
  }).then(() => {
    console.log(`Tasks from List: ${_listId} were deleted`);
  });
};

module.exports = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
};
