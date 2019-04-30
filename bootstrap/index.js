/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
const _ = require('lodash');

module.exports = async function bootstrap({
  isDevMode = sails.config.environment === 'development',
  isProdMode = sails.config.environment === 'production',
  isInitSeedData = true,
  isInitExtendData = true,
} = {}) {
  try {
    console.log('bootstrap in-app-notification');
  } catch (e) {
    throw e;
  }
};
