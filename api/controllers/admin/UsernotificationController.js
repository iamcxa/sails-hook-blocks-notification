/* eslint no-underscore-dangle: 0 */
const modelName = 'UserNotification';
const apiPrefix = '/api';
const area = 'admin';

const showDetailPage = async (req, res, action = 'detail') => {
  try {
    const {
      id,
      langCode = res.langCode(),
    } = req.allParams();
    const title = `${sails.__({
      phrase: `menuitem.model.${modelName}`,
      locale: langCode,
    })}(${sails.__({
      phrase: `view.detail.mode.${action}`,
      locale: langCode,
    })})`;
    return res.view('admin/default/detail', {
      page: {
        isEmpty: action === 'detail',
        name: modelName.toLowerCase(),
        apiPrefix,
        area,
        title,
        action,
        id,
      },
      data: await QueryService.getDetailPageFieldWithAssociations({
        modelName,
        langCode,
      }),
    });
  } catch (e) {
    return res.error(e);
  }
};

export async function index(req, res) {
  sails.log(`=== VIEW:${modelName}Controller:index ===`);
  try {
    const {
      langCode = res.langCode(),
    } = req.allParams();
    const title = sails.__({
      phrase: `menuitem.model.${modelName}`,
      locale: langCode,
    });
    return res.view('admin/default/index', {
      page: {
        name: modelName.toLowerCase(),
        apiPrefix,
        area,
        title,
      },
      data: null,
    });
  } catch (e) {
    return res.error(e);
  }
}

export async function detail(req, res) {
  return showDetailPage(req, res, 'detail');
}

export async function create(req, res) {
  return showDetailPage(req, res, 'create');
}
