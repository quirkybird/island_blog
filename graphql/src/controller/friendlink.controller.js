const FriendLinkService = require("../service/friendlink.service");

class FriendLinkController {
  constructor() {
    this.service = new FriendLinkService();
  }

  create = async (ctx) => {
    try {
      const data = await this.service.create(ctx.request.body);
      ctx.body = {
        code: 200,
        data,
        message: "创建成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message,
      };
    }
  };

  findAll = async (ctx) => {
    try {
      const data = await this.service.findAll();
      ctx.body = {
        code: 200,
        data,
        message: "查询成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message,
      };
    }
  };

  findOne = async (ctx) => {
    try {
      const id = parseInt(ctx.params.id);
      const data = await this.service.findOne(id);
      if (data) {
        ctx.body = {
          code: 200,
          data,
          message: "查询成功",
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "友链不存在",
        };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message,
      };
    }
  };

  update = async (ctx) => {
    try {
      const id = parseInt(ctx.params.id);
      const data = await this.service.update(id, ctx.request.body);
      ctx.body = {
        code: 200,
        data,
        message: "更新成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message,
      };
    }
  };

  delete = async (ctx) => {
    try {
      const id = parseInt(ctx.params.id);
      await this.service.delete(id);
      ctx.body = {
        code: 200,
        message: "删除成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message,
      };
    }
  };
}

module.exports = new FriendLinkController();
