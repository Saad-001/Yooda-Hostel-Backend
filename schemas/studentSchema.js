const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hallName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
});

module.exports = studentSchema;
