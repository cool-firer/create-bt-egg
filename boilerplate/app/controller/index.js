'use strict';
const Controller = require('egg').Controller;

class IndexController extends Controller {
  async checkAlive() {
    const { ctx, app } = this;
    ctx.body = {
      code: 200,
      message: 'succcess',
      name: app.config.pkg.name,
      version: app.config.pkg.version,
    };
  }
}

module.exports = IndexController;
