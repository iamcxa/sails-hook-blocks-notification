import SNSHelper from 'aws-sns-helper';
import _ from 'lodash';

module.exports = {
  snsHelper: null,
  getSnsHelper() {
    const ENV = sails.config.environment;
    const {
      AWS_SNS_ARN_APNS,
      AWS_SNS_ARN_APNS_SANDBOX,
      AWS_SNS_ARN_GCM,
      SNS_KEY,
      SNS_SECRET,
      SNS_REGION,
      IS_ON_SERVER = null,
    } = sails.config.aws.sns;
    if (!this.snsHelper) {
      this.snsHelper = new SNSHelper({
        AWS_SNS_ARN_APNS,
        AWS_SNS_ARN_APNS_SANDBOX,
        AWS_SNS_ARN_GCM,
        SNS_KEY,
        SNS_SECRET,
        SNS_REGION,
        ENV,
        // 真實送出 for test
        IS_ON_SERVER: IS_ON_SERVER === null
          ? ENV === 'production'
          : IS_ON_SERVER,
      });
    }
    return this.snsHelper;
  },
  /**
   *
   * 設定 Notification 為全部已讀
   * @param {*} id
   * @returns
   */
  async readAll({
    userId,
  }) {
    try {
      const data = await UserNotification.update({
        isRead: true,
      }, {
        where: {
          UserId: userId,
        },
      });
      return data;
    } catch (e) {
      throw e;
    }
  },

  /**
   *
   * 設定 Notification 為已讀
   * @param {*} id
   * @returns
   */
  async read({
    userId,
    notificationId,
  }) {
    try {
      const data = await UserNotification.update({
        isRead: true,
      }, {
        where: {
          NotificationId: notificationId,
          UserId: userId,
        },
      });
      sails.log('NotificationHelper.read=>', data);
      return data;
    } catch (e) {
      throw e;
    }
  },

  async buildNotification({
    userIds = [],
    data,
    platform,
  }) {
    try {
      // sails.log('create Notification');
      let devices = [];
      const notification = await Notification.create(_.omit(data, ['id']));
      if (userIds) {
        /* eslint-disable no-await-in-loop */
        for (const userId of userIds) {
          if (platform === 'WEB') {
            await UserNotification.create({
              NotificationId: notification.id,
              UserId: userId,
            });
          } else {
            const user = await User.findOneWithDevices(userId);
            if (user) {
              if (_.isNil(user.UserDevices)
                  || _.isEmpty(user.UserDevices)) {
                sails.log.warn(`user id "${user.id}" has no UserDevices.`);
              } else {
                devices = await this.mergeNotificationWithDevices({
                  userDevices: user.UserDevices,
                  notification,
                });
              }
            }
          }
        }
      }
      return devices;
    } catch (error) {
      sails.log.error(error);
      throw error;
    }
  },


  /**
   * 將 data 轉為 Notification 後直接推給 userIds
   * @param {*} {
   *     userIds = [],
   *     data,
   *     platform
   *   }
   */
  async pushMessage({
    userIds = [],
    data,
    platform,
  }) {
    sails.log('send message directly');
    const ENV = sails.config.environment;
    let devices = [];
    try {
      devices = await this.buildNotification({
        userIds,
        data,
        platform,
      });
      const messages = this.buildMessagesWithDevicePlatform({
        devices,
        ENV,
        title: data.title,
        message: data.message,
      });
      // console.log('=========== \nmessages=>', messages);
      return await this.getSnsHelper().pushNotificationBatch({
        messages,
        defaultAttributesData: data.messageAttributes,
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },

  /**
   * 確認 userDevices 後建立 UserNotification
   * @param {*} {
   *     userDevices = [],
   *     notification,
   *   }
   */
  async mergeNotificationWithDevices({
    userDevices = [],
    notification,
  }) {
    const devices = [];
    try {
      for (const device of userDevices) {
        // console.log('device.platform=>', device.platform);
        // console.log('device.deviceToken=>', device.deviceToken);
        // console.log('mergeNotificationWithDevices notification.id=>', notification.id);
        if (device.deviceToken && device.platform) {
          await UserNotification.create({
            NotificationId: notification.id,
            UserDeviceId: device.id,
            UserId: device.UserId,
            platform: device.platform,
            deviceToken: device.deviceToken,
          });
          devices.push(device);
        } else {
          sails.log.error(`device id "${device.id}" has no deviceToken or platform.`);
        }
      }
      return devices;
    } catch (e) {
      throw e;
    }
  },

  /**
   * 將輸數參數格式化成要推給 AWS SNS 的格式
   * @param {*} {
   *     devices = [],
   *     ENV = 'development',
   *     title,
   *     message,
   *   }
   */
  buildMessagesWithDevicePlatform({
    devices = [],
    ENV = 'development',
    title,
    message,
  }) {
    return devices.map((device) => {
      let platform = 'GCM';
      let devicePlatform = 'android';
      if (device.platform === 'IOS_FCM') {
        devicePlatform = 'ios';
        platform = 'GCM';
      } else if (device.platform === 'IOS_APNS') {
        devicePlatform = 'ios';
        platform = 'APNS';
        if (ENV === 'staging' || ENV === 'development' || ENV === 'test') {
          platform = 'APNS_SANDBOX';
        }
      }
      return {
        title,
        message,
        notification: message,
        messageAttributes: {},
        deviceToken: device.deviceToken,
        notifyCount: 0,
        platform,
        devicePlatform,
      };
    });
  },

  /**
   *
   * @param {*} {
   *     Users = [],
   *     title = '',
   *     message = '',
   *     messageAttributes = null,
   *   }
   * @returns
   */
  async pushMessageWithModel({
    Users = [],
    title = '',
    message = '',
    messageAttributes = null,
  }) {
    sails.log('send message by model');
    const ENV = sails.config.environment;
    const devices = [];
    try {
      Users.forEach((user) => {
        if (_.isNil(user.UserDevices)
            || _.isEmpty(user.UserDevices)) {
          sails.log.error(`user id "${user.id}" has no UserDevices.`);
        } else {
          devices.push(...user.UserDevices.filter(d => !_.isNil(d.deviceToken)));
          // sails.log.debug('notification will push to devices=>', devices);
        }
      });
      const messages = this.buildMessagesWithDevicePlatform({
        devices,
        ENV,
        title,
        message,
      });
      return await this.getSnsHelper().pushNotificationBatch({
        messages,
        defaultAttributesData: messageAttributes,
      });
    } catch (error) {
      sails.log.error(error);
      throw error;
    }
  },
};
