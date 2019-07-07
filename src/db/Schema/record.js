const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  openId: String,
  recordTime: Number,
  type: Number,
  //1 早餐 2午餐 3 晚餐
  foodList: Array
});
module.exports = RecordSchema;
