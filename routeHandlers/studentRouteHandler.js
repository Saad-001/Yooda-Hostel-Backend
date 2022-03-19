const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const studentSchema = require("../schemas/studentSchema");
const StudentsList = mongoose.model("studentCollection", studentSchema);

router.get("/", (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  StudentsList.find({}, (err, data) => {
    if (!err) {
      res.status(200).json({
        result: data.slice(startIndex || 0, endIndex || 5),
      });
    } else {
      res.status(500).json({
        error: err.message,
      });
    }
  }).clone();
});

router.post("/addStudent", async (req, res) => {
  const newStudent = new StudentsList(req.body);
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

router.put("/:id", (req, res) => {
  const studentId = req.params.id;
  console.log(req.body);
  const updatedData = req.body;
  StudentsList.findOneAndUpdate(
    { _id: studentId },
    updatedData,
    { new: true },
    (err, data) => {
      if (err) {
        res.json({
          error: err.message,
        });
      } else {
        res.json({
          updatedResult: data,
        });
      }
    }
  ).clone();
});

router.put("/status/updateAll", (req, res) => {
  StudentsList.find({ _id: { $in: req.body.ids } }, (err, data) => {
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
