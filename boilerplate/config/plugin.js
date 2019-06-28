'use strict';

/** @type Egg.EggPlugin */
module.exports = {

  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  validate: {
    enable: true,
    package: 'egg-validate',
  },

  btEggOpenapi: false,
  
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },

};
