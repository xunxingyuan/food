const db = require("../../db/index");
const User = db.User;
const config = require("../../../conf/conf");
const Json = require("../../tools/jsonResponse");
const Http = require("axios");
const food = db.Food;

//获取用户openId

async function getUser(code) {
  let url =
    "https://api.weixin.qq.com/sns/jscode2session?appid=" +
    config.wechat.AppID +
    "&secret=" +
    config.wechat.AppSecret +
    "&js_code=" +
    code +
    "&grant_type=authorization_code";
  return await Http.get(url);
}

//创建用户
async function createUser(ctx, data) {
  let add = await new User(data).save();
  if (add) {
    Json.res(ctx, 200, "创建用户并且登录成功");
  } else {
    Json.res(ctx, 10002, "用户创建失败");
  }
}

//更新用户
async function updateUser(ctx, data) {
  let update = await User.updateOne(
    {
      openid: data.openid
    },
    {
      $set: data
    }
  );
  if (update) {
    Json.res(ctx, 200, "登录成功");
  } else {
    Json.res(ctx, 10001, "用户信息更新失败");
  }
}

module.exports = {
  login: async (ctx, next) => {
    let req = ctx.request.body;
    let user = ctx.request.body.sessionUser;
    let now = new Date().getTime();
    //检查缓存
    if (user) {
      let userInfo = user;
      if (userInfo.login_expire > now) {
        ctx.session.user = JSON.stringify(user);
        Json.res(ctx, 200, "登录成功");
      } else {
        let result = await getUser(req.code);
        if (result.data) {
          let updateData = {
            session_key: result.data.session_key,
            session_key_expire: now + 7200 * 1000
          };
          if (result.data.unionid) {
            updateData["unionid"] = result.data.unionid;
          }
          ctx.session.user = JSON.stringify({
            openid: updateData.openid,
            login_expire: updateData.session_key_expire
          });
          await updateUser(ctx, updateData);
        } else {
          Json.res(ctx, 10003, "微信用户授权失败");
        }
      }
    } else {
      let result = await getUser(req.code);
      console.log(result.data);

      if (result.data) {
        //检查是否存在用户
        let check = await User.findOne({
          openid: result.data.openid
        });
        if (check) {
          //更新用户
          let updateData = {
            session_key: result.data.session_key,
            session_key_expire: now + 7200 * 1000
          };
          if (result.data.unionid) {
            updateData["unionid"] = result.data.unionid;
          }
          ctx.session.user = JSON.stringify({
            openid: result.data.openid,
            login_expire: updateData.session_key_expire
          });
          await updateUser(ctx, updateData);
        } else {
          //新建用户
          let addData = {
            openid: result.data.openid,
            session_key: result.data.session_key,
            session_key_expire: now + 7200 * 1000,
            unionid: "",
            nickName: "",
            gender: "",
            city: "",
            province: "",
            country: "",
            avatarUrl: ""
          };
          if (result.data.unionid) {
            addData["unionid"] = result.data.unionid;
          }
          ctx.session.user = JSON.stringify({
            openid: addData.openid,
            login_expire: addData.session_key_expire
          });
          await createUser(ctx, addData);
          //初始化食物
          let foodArr = [
            {
              name: "粥",
              type: 1
            },
            {
              name: "面条",
              type: 1
            },
            {
              name: "红烧肉",
              type: 2
            },
            {
              name: "红烧鱼",
              type: 2
            },
            {
              name: "清炒土豆丝",
              type: 3
            },
            {
              name: "清炒菜心",
              type: 3
            },
            {
              name: "玉米排骨汤",
              type: 4
            },
            {
              name: "莲子汤",
              type: 4
            },
            {
              name: "炒面",
              type: 6
            },
            {
              name: "炒饭",
              type: 6
            },
            {
              name: "苹果",
              type: 6
            },
            {
              name: "葡萄",
              type: 6
            }
          ];
          foodArr.forEach(e => {
            e["openId"] = result.data.openid;
          });
          await food.insertMany(foodArr);
        }
      } else {
        Json.res(ctx, 10003, "微信用户授权失败");
      }
    }
  },
  getUserInfo: async (ctx, next) => {
    let userInfo = ctx.request.body.sessionUser;
    let user = await User.findOne({
      openid: userInfo.openid
    });
    Json.res(ctx, 200, user);
    if (user) {
      Json.res(ctx, 200, user);
    } else {
      Json.res(ctx, 202, "用户不存在");
    }
  },
  updateInfo: async (ctx, next) => {
    let userInfo = ctx.request.body.sessionUser;
    let req = ctx.request.body;
    let addData = {
      nickName: req.nickName,
      gender: req.gender,
      city: req.city,
      province: req.province,
      country: req.country,
      avatarUrl: req.avatarUrl
    };
    let update = await User.updateOne(
      {
        openid: userInfo.openid
      },
      {
        $set: addData
      }
    );
    if (update) {
      Json.res(ctx, 200, "更新成功");
    } else {
      Json.res(ctx, 202, "用户不存在");
    }
  }
};
