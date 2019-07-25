const Json = require("../../tools/jsonResponse");
const Http = require("axios");
const db = require("../../db/index");
const food = db.Food;
const record = db.Record;
const config = require("../../../conf/conf.js");

module.exports = {
  //检索食物
  getFoods: async (ctx, next) => {
    let types = ctx.request.query.types;
    let user = ctx.request.body.sessionUser;

    console.log(types);
    console.log(user.openid);

    let result;
    if (types != undefined) {
      result = await food.find({
        openId: user.openid,
        type: types
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
    let user = ctx.request.body.sessionUser;
    if (req._id) {
      //更新
      result = await food.updateOne(
        {
          openId: user.openid,
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
        openId: user.openid,
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
    let reqId = ctx.request.query._id
      ? ctx.request.query._id
      : ctx.request.body._id;
    let user = ctx.request.body.sessionUser;
    if (reqId !== undefined) {
      let findData = await food.find({
        openId: user.openid,
        _id: reqId
      });
      if (findData) {
        let result = await food.remove({
          openId: user.openid,
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
    let user = ctx.request.body.sessionUser;
    console.log(req);
    let now = new Date().getTime();
    let arr = JSON.parse(req.foodList);
    let result = await new record({
      recordTime: now,
      foodList: arr,
      type: req.type,
      openId: user.openid
    }).save();
    if (result) {
      Json.res(ctx, 200, "添加成功");
    } else {
      Json.res(ctx, 40001, "添加失败");
    }
  },
  //获取记录
  getRecord: async (ctx, next) => {
    let user = ctx.request.body.sessionUser;

    let result = await record.find({
      openId: user.openid
    });
    if (result) {
      let arr = [];
      result.forEach(element => {
        arr.push({
          foodList: element.foodList,
          _id: element._id,
          recordTime: element.recordTime,
          type: element.type
        });
      });
      Json.res(ctx, 200, "获取成功", arr);
    } else {
      Json.res(ctx, 40001, "添加失败");
    }
  },
  //删除记录
  delRecord: async (ctx, next) => {
    let reqId = ctx.request.query._id
      ? ctx.request.query._id
      : ctx.request.body._id;
    let user = ctx.request.body.sessionUser;
    if (reqId !== undefined) {
      let findData = await record.find({
        openId: user.openid,
        _id: reqId
      });
      if (findData) {
        let result = await record.remove({
          $and: [
            {
              openId: user.openid
            },
            {
              _id: reqId
            }
          ]
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
  //检索菜谱
  getFoodMenu: async (ctx, next) => {
    let req = ctx.request.query;

    let getData = {
      cpName: req.cpName,
      maxResults: req.maxResults,
      page: req.page,
      type: req.type
    };
    let result = await Http.get(
      "http://caipu.market.alicloudapi.com/showapi_cpQuery",
      {
        headers: {
          Authorization: "APPCODE " + config.food.code
        },
        params: getData
      }
    );
    if (result.data.status == "0") {
      Json.res(ctx, 200, "获取成功", result.data.result);
    } else {
      Json.res(ctx, 40001, "获取失败");
    }
  }
};
