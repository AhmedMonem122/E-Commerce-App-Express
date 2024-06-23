const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    validate: [validator.isEmail, "This field must be a valid email address!"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password!"],
    minlength: [8, "Password should be 8 characters or more!"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and Password Confirm are not the same!",
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
