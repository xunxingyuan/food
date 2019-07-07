const Json = require("../../tools/jsonResponse");
const Http = require("axios");
const db = require("../../db/index");
const food = db.Food;
const record = db.Record;

module.exports = {
  //检索食物
  getFoods: async (ctx, next) => {
    let types = ctx.request.query.types;
    console.log(types);
    let arr = [];
    if (types != undefined) {
      types.split(",").forEach(e => {
        arr.push({
          type: e
        });
      });
    }
    let result;
    if (types != undefined && arr.length > 0) {
      result = await food.find({
        $or: arr
      });
    } else {
      result = await food.find();
    }
    if (result) {
      let resultData = [];
      result.forEach(e => {
        resultData.push({
          _id: e._id,
          name: e.name,
          type: e.type
        });
      });
      Json.res(ctx, 200, "获取成功", resultData);
    } else {
      Json.res(ctx, 40001, "获取失败");
    }
  },
  //添加、更新食物
  updateFood: async (ctx, next) => {
    let req = ctx.request.body;
    console.log(req);
    let find;
    if (req._id) {
      find = await food.find({
        _id: req._id
      });
    } else {
      find = false;
    }
    let result;
    if (find) {
      //更新
      result = await food.updateOne(
        {
          _id: req._id
        },
        {
          $set: {
            name: req.name,
            type: req.type
          }
        }
      );
    } else {
      //新增
      result = await new food({
        name: req.name,
        type: req.type
      }).save();
    }
    if (result) {
      Json.res(ctx, 200, "数据更新成功");
    } else {
      Json.res(ctx, 40001, "数据更新失败");
    }
  },
  //删除食物
  deleteFood: async (ctx, next) => {
    let reqId = ctx.request.query._id;
    if (reqId !== undefined) {
      let findData = await food.find({
        _id: reqId
      });
      if (findData) {
        let result = await food.remove({
          _id: reqId
        });
        if (result) {
          Json.res(ctx, 200, "删除成功");
        } else {
          Json.res(ctx, 40001, "删除失败");
        }
      } else {
        Json.res(ctx, 40001, "删除失败，不存在该条数据");
      }
    } else {
      Json.res(ctx, 40002, "参数不完整");
    }
  },

  //记录饮食
  recordList: async (ctx, next) => {
    let req = ctx.request.body;
    console.log(req);
    let now = new Date().getTime();
    let arr = JSON.parse(req.foodList);
    let result = await new record({
      recordTime: now,
      foodList: arr,
      type: req.type
    }).save();
    if (result) {
      Json.res(ctx, 200, "添加成功");
    } else {
      Json.res(ctx, 40001, "添加失败");
    }
  },
  //获取记录
  getRecord: async (ctx, next) => {
    let result = await record.find();
    if (result) {
      let arr = [];
      result.forEach(element => {
        arr.push({
          foodList: element.foodList,
          _id: element._id,
          recordTime: element.recordTime
        });
      });
      Json.res(ctx, 200, "获取成功", arr);
    } else {
      Json.res(ctx, 40001, "添加失败");
    }
  },
  //删除记录
  delRecord: async (ctx, next) => {
    let reqId = ctx.request.query._id;
    if (reqId !== undefined) {
      let findData = await record.find({
        _id: reqId
      });
      if (findData) {
        let result = await record.remove({
          _id: reqId
        });
        if (result) {
          Json.res(ctx, 200, "删除成功");
        } else {
          Json.res(ctx, 40001, "删除失败");
        }
      } else {
        Json.res(ctx, 40001, "删除失败，不存在该条数据");
      }
    } else {
      Json.res(ctx, 40002, "参数不完整");
    }
  }
};
