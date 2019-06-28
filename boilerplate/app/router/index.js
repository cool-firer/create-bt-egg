'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/alive', controller.index.checkAlive);
};
