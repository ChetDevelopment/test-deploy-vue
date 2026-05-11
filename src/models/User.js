const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model("User", UserSchema);
