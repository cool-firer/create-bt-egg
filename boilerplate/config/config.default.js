/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your middleware config here
  config.middleware = [];

  config.models = {
    sequelize: {
      tables: {
        package: '@bt/bt-sequelize-tables-prerelease-v2',
      },
    },
  };
  config.serverRequest = {
    prefix: 'v2-',
  };

  return config;
};
