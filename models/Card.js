const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
  title: { type: 'String', required: true },
  color: { type: 'String', required: true },
  desc: {type: 'String', required: true},
  url: { type: 'String', required: true },
  postUrl: { type: 'String', required: true }
});

mongoose.model('Card', cardSchema);
