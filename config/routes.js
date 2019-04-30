module.exports.routes = {
  // 後台管理
  'get /api/admin/userdevice': 'api/admin/UserdeviceController.query',
  'delete /api/admin/userdevice': 'api/admin/UserdeviceController.destroy',
  'get /api/admin/userdevice/:id': 'api/admin/UserdeviceController.detail',
  'post /api/admin/userdevice': 'api/admin/UserdeviceController.create',
  'put /api/admin/userdevice/:id': 'api/admin/UserdeviceController.update',

  'get /api/admin/usernotification': 'api/admin/UsernotificationController.query',
  'delete /api/admin/usernotification': 'api/admin/UsernotificationController.destroy',
  'get /api/admin/usernotification/:id': 'api/admin/UsernotificationController.detail',
  'post /api/admin/usernotification': 'api/admin/UsernotificationController.create',
  'put /api/admin/usernotification/:id': 'api/admin/UsernotificationController.update',
};
