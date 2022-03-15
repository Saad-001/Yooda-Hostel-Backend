const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const studentSchema = require("../schemas/studentSchema");
const StudentLists = mongoose.model("studentCollection", studentSchema);

router.get("/", async (req, res) => {
  await StudentLists.find({}, (err, data) => {
    if (!err) {
      res.status(200).json({
        result: data,
      });
    } else {
      res.status(500).json({
        error: err.message,
      });
    }
  }).clone();
});

router.post("/addStudent", async (req, res) => {
  const newStudent = new StudentLists(req.body);
  await newStudent
    .save()
    .then((newStudentData) => {
      res.json({
        result: newStudentData,
      });
    })
    .catch((err) => {
      res.json({
        error: err.message,
      });
    });
});

router.put("/updateAll", async (req, res) => {
  await StudentLists.find({ _id: { $in: req.body.ids } }, (err, data) => {
    if (!err) {
      for (let i = 0; i < data.length; i++) {
        data[i]?.status && data[i].status === "Active"
          ? (data[i].status = "Inactive")
          : (data[i].status = "Active");
        data[i].save();
      }
      res.status(200).json({
        message: "requested data has been updated successfully",
      });
    } else {
      res.status(404).json({
        error: err.message,
      });
    }
  }).clone();
});

module.exports = router;
