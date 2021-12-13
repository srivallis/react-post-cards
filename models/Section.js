const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectionSchema = new Schema({
  heading: { type: 'String', required: true },
  subtext: { type: 'String', required: true }
});

mongoose.model('Section', sectionSchema);
