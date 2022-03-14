const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const foodSchema = require("../schemas/foodSchema");
const FoodItems = new mongoose.model("FoodCollection", foodSchema);

router.get("/allFoods", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  await FoodItems.find({}, (err, data) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.status(200).json({
        result: data.slice(startIndex || 0, endIndex || 5),
        message: "here is the all food items",
      });
    }
  }).clone();
});

router.post("/addFood", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const newFoodItem = new FoodItems(req.body);

  await newFoodItem.save((err, data) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      FoodItems.find({}, (err, data) => {
        if (err) {
          res.status(500).json({
            error: err.message,
          });
        } else {
          res.status(200).json({
            result: data.reverse().slice(startIndex || 0, endIndex || 5),
            message: "here is the all food items",
          });
        }
      }).clone();
    }
  });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const updatedData = req.body;
  await FoodItems.findOneAndUpdate(
    { _id: id },
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await FoodItems.findOneAndDelete({ _id: id })
    .then((result) => {
      res.status(200).json({
        deletedItem: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

module.exports = router;
