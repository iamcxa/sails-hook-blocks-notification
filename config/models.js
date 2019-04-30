/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {
  scope: {
  },
  classMethods: {
    UserNotification: {},
    Notification: {},
    User: {
      async findOneWithDevices(id) {
        try {
          const user = await User.findOne({
            where: { id },
            include: [UserDevice],
          });
          return user;
        } catch (e) {
          throw e;
        }
      },
    },
  },
  instanceMethods: {
    UserNotification: {},
    Notification: {},
  },
  hooks: {
    UserNotification: {},
    Notification: {},
  },
};
