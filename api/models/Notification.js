module.exports = {
  attributes: {
    title: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    message: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    targetId: {
      type: Sequelize.STRING,
    },

    messageAttributes: {
      type: Sequelize.JSON,
      allowNull: true,
      get() {
        try {
          const val = this.getDataValue('messageAttributes');
          return val ? JSON.parse(val) : null;
        } catch (err) {
          sails.log.warn('Notification.messageAttributes parse json failed: ', err);
          return this.getDataValue('messageAttributes');
        }
      },
    },

    messageType: {
      type: Sequelize.ENUM('PUSH', 'EMAIL', 'SMS'),
      allowNull: true,
    },

    tag: {
      type: Sequelize.JSON,
      allowNull: true,
      get() {
        try {
          const val = this.getDataValue('tag');
          return val ? JSON.parse(val) : null;
        } catch (err) {
          sails.log.warn('Notification.tag: parse json failed: ', err);
          return this.getDataValue('tag');
        }
      },
    },
  },
  associations() {
    if (!User) {
      throw Error('sails-hook-blacksails-notification needs Blacksails User model!');
    }
  },
  options: {
    classMethods: {
      ...sails.config.models.classMethods.Notification,
    },
    instanceMethods: {
      ...sails.config.models.instanceMethod.Notification,
    },
    hooks: {
      ...sails.config.models.hook.Notification,
    },
  },
};
