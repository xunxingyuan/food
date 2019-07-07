const router = require("koa-router")();
const common = require("../src/controller/food/common");
router.prefix("/myfood");

router.get("/search", async (ctx, next) => {
  await common.getFoods(ctx, next);
});
router.post("/update", async (ctx, next) => {
  await common.updateFood(ctx, next);
});
router.delete("/delete", async (ctx, next) => {
  await common.deleteFood(ctx, next);
});
router.post("/record", async (ctx, next) => {
  await common.recordList(ctx, next);
});
router.get("/getRecord", async (ctx, next) => {
  await common.getRecord(ctx, next);
});
router.delete("/deleteRecord", async (ctx, next) => {
  await common.delRecord(ctx, next);
});
module.exports = router;
