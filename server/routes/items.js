const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schema
const ItemsSchema = mongoose.Schema({
   userId: {
      type: String,
      required: true,
   },
   content: {
      type: String,
      required: true,
   },
   type: {
      type: String,
      required: true,
   },
   completed: {
      type: Boolean,
      required: true,
   },
   category: String,
   dateTime: String,
});

// Model
const Item = mongoose.model("Item", ItemsSchema);

// Routes

router.get("/:userId", async (req, res) => {
   const userItems = await Item.find({ userId: req.params.userId });
   res.json(userItems);
});

router.post("/:userId", async (req, res) => {
   const item = new Item({
      ...req.body,
      userId: req.params.userId,
   });
   const newItem = await item.save();
   res.json(newItem);
});

router.delete("/:itemId", async (req, res) => {
   const deletedItem = await Item.findOneAndDelete({
      _id: req.params.itemId,
   });
   res.json(deletedItem);
});

router.put("/:itemId", async (req, res) => {
   const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.itemId },
      req.body,
      { new: true }
   );
   res.json(updatedItem);
});

module.exports = router;
