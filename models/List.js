const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdDate: {
    type: Date,
    default: () => Date.now(),
  },
  description: {
    type: String,
    required: false,
  },
});

const List = mongoose.model('list', listSchema);

module.exports = {
  List,
};
