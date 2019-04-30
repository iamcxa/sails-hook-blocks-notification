module.exports = {
  attributes: {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },

    platform: {
      type: Sequelize.ENUM('ANDROID', 'IOS_FCM', 'IOS_APNS', 'WEB'),
    },

    deviceToken: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },

    isRead: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
      set(val) {
        if (val) {
          this.setDataValue('isRead', val);
          this.setDataValue('readAt', new Date());
        }
      },
    },

    readAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  associations() {
    if (!User) {
      throw Error('sails-hook-notification needs an User model!');
    }
    // User.belongsToMany(Notification, {
    //   through: UserNotification,
    //   foreignKey: {
    //     name: 'UserId',
    //     as: 'Users',
    //   },
    //   unique: false,
    // });
    // Notification.belongsToMany(User, {
    //   through: UserNotification,
    //   foreignKey: {
    //     name: 'NotificationId',
    //     as: 'Notifications',
    //   },
    //   unique: false,
    // });
    UserNotification.belongsTo(UserDevice);
    UserNotification.belongsTo(Notification);
    UserNotification.belongsTo(User);
  },
  options: {
    paranoid: false,
    timestamps: true,
    classMethods: {
      ...sails.config.models.classMethod.UserNotification,
      associations() {
        return {
          belongsTo: ['User', 'Notification'],
          hasMany: ['UserNotification', 'UserNotification'],
          hasOne: [],
          belongsToMany: [],
        };
      },
    },
    instanceMethods: {
      ...sails.config.models.instanceMethod.UserNotification,
    },
    hooks: {
      ...sails.config.models.hook.UserNotification,
    },
  },
};
