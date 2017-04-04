const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
var Post = require('./model');
var config = require('./config/config');

const app = express();
const db = mongoose.connection;

mongoose.connect(config.db.url);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to the db!')
});

app.use(morgan('dev'));
// app.use(express.static('client'));
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/', (req, res) => {
  Post.find({})
    .then((data) => {
      res.send(data);
    });
});

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

app.listen(config.port);
console.log(`app running on ${config.port}`);
