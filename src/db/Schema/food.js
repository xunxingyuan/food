const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  name: String,
  type: Number
  //type: 1 早餐类  2 肉类  3 青菜类  4 汤  5  简餐类
});
module.exports = FoodSchema;
