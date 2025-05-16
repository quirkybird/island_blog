const Router = require("@koa/router");
const FriendLinkController = require("../controller/friendlink.controller");

const friendLinkRouter = new Router({ prefix: "/friend-links" });

friendLinkRouter.post("/", FriendLinkController.create);
friendLinkRouter.get("/", FriendLinkController.findAll);
friendLinkRouter.get("/:id", FriendLinkController.findOne);
friendLinkRouter.put("/:id", FriendLinkController.update);
friendLinkRouter.delete("/:id", FriendLinkController.delete);

module.exports = friendLinkRouter;
