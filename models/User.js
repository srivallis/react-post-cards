const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: 'String', required: true, unique: true },
  username: { type: 'String'}
});

mongoose.model('User', userSchema);
