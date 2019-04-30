/* eslint-disable global-require */

module.exports = function init(sails) {
  const loader = require('sails-util-micro-apps')(sails);
  return {
    defaults: {
      __configKey__: {
        // sails-config
        name: 'blacksails-notification',
        exposeToGlobal: true,
        _hookTimeout: 120 * 1000,
        // hook config
        enable: true,
        ses: {
          SES_KEY: '',
          SES_SECRET: '',
          SES_REGION: '',
        },
        sns: {
        },
      },
    },
    configure() {
      loader.configure({
        policies: `${__dirname}/api/policies`,
        config: `${__dirname}/config`,
        assets: `${__dirname}/assets`,
        views: `${__dirname}/views`,
      });
    },
    initialize(next) {
      loader.inject({
        models: `${__dirname}/api/models`,
        helpers: `${__dirname}/api/helpers`,
        services: `${__dirname}/api/services`,
        responses: `${__dirname}/api/responses`,
        controllers: `${__dirname}/api/controllers`,
      }, err => next(err));
    },
    async bootstrap({ isInitSeedData, isInitFakeData }) {
      try {
        const bootstraps = require('./bootstrap/index');
        await bootstraps({ isInitSeedData, isInitFakeData });
      } catch (e) {
        throw e;
      }
    },
  };
};
