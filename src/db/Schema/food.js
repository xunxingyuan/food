const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  openId: String,
  name: String,
  type: Number
  //type: 1 早餐类  2 肉类  3 青菜类  4 汤  5  简餐类  6 水果
});
module.exports = FoodSchema;
