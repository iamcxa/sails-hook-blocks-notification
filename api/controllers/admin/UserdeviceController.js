/* eslint no-underscore-dangle: 0 */
const modelName = 'UserDevice';
const apiPrefix = '/api';
const area = 'admin';
const name = 'userdevice';

const showDetailPage = async (req, res, action = 'detail') => {
  try {
    const {
      id,
      langCode = res.langCode(),
    } = req.allParams();
    const title = `${sails.__({
      phrase: `menuitem.model.${name}`,
      locale: langCode,
    })}(${sails.__({
      phrase: `view.detail.mode.${action}`,
      locale: langCode,
    })})`;
    return res.view('admin/default/detail', {
      page: {
        isEmpty: action === 'detail',
        apiPrefix,
        area,
        name,
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
      phrase: `menuitem.model.${name}`,
      locale: langCode,
    });
    return res.view('admin/default/index', {
      page: {
        apiPrefix,
        area,
        name,
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
