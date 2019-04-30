module.exports.policies = {
  'admin/NotificationController': {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  'api/admin/NotificationController': {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },
};
