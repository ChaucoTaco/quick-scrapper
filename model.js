const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
  title: String,
  comments: String,
  karma: String
});

module.exports = mongoose.model('blogpost', postSchema);
