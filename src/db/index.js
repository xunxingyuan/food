const mongoose = require("mongoose");
const config = require("../../conf/conf");
const options = {
  user: config.mongodb.auth.user,
  pass: config.mongodb.auth.password,
  path: config.mongodb.path
};

//数据库Schema
const userSchema = require("./Schema/user");
const wetchatSchema = require("./Schema/wechat");
const foodSchema = require("./Schema/food");
const recordSchema = require("./Schema/record");

//数据库认证
let authUrl =
  "mongodb://" + options.user + ":" + options.pass + "@" + options.path;
mongoose.connect(authUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "连接错误："));
db.once("open", callback => {
  console.log("MongoDB连接成功！！");
});

//导出model
exports.User = mongoose.model("users", userSchema, "users");
exports.Wechat = mongoose.model("wechat", wetchatSchema, "wechat");
exports.Food = mongoose.model("food", foodSchema, "food");
exports.Record = mongoose.model("record", recordSchema, "record");
