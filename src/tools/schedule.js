const schedule = require("node-schedule");

const scheduleCronstyle = () => {
  //每分钟的第30秒定时执行一次:
  schedule.scheduleJob("30 * * * * *", () => {
    console.log("scheduleCronstyle:" + new Date());
  });
};

//更新每日推荐

scheduleCronstyle();
