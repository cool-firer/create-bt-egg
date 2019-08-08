'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async checkAlive() {
    this.ctx.body = {
      code: 200,
      project: this.app.config.pkg.name,
      version: this.app.config.pkg.version,
    };
  }
}

module.exports = HomeController;
