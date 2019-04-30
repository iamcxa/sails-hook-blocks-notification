
import moment from 'moment';

const modelName = 'UserNotification';
const message = 'success';
const dateFormat = 'YYYY-MM-DD';

export async function detail(req, res) {
  sails.log(`=== API:${modelName}Controller:detail ===`);
  try {
    const {
      id,
      langCode = res.langCode(),
    } = req.allParams();
    const extraData = {};
    const include = [{"modelName":"User"},{"modelName":"Notification"}];
    const data = await QueryService.getDetail({
      langCode,
      modelName,
      where: { id },
      attributes: null,
      include,
    }, {
      view: true,
      required: null,
      readonly: null,
      format: null,
      formatCb: e => ({
        ...e,
        createdAt: moment(e.createdAt).format(dateFormat),
        updatedAt: moment(e.updatedAt).format(dateFormat),
      }),
    });
    return res.ok({
      message,
      data: {
        ...data,
        ...extraData,
      },
    });
  } catch (e) {
    return res.error(e);
  }
}

export async function query(req, res) {
  sails.log(`=== API:${modelName}Controller:query ===`);
  try {
    const {
      langCode = res.langCode(),
      search,
      curPage,
      perPage,
      fields,
      status,
      sort,
      by,
    } = req.allParams();
    const include = [{"modelName":"User"},{"modelName":"Notification"}];
    const data = await QueryService.findBy({
      modelName,
      include,
    }, {
      filter: {
        langCode,
        status,
        fields: fields ? JSON.parse(decodeURIComponent(fields)) : [],
        search: {
          keyword: search,
          extra: [],
        },
      },
      curPage,
      perPage,
      sort,
      by,
    }, {
      format: null,
      formatCb: e => ({
        ...e,
        createdAt: moment(e.createdAt).format(dateFormat),
        updatedAt: moment(e.updatedAt).format(dateFormat),
      }),
    });
    
    return res.ok({
      message,
      data,
    });
  } catch (e) {
    sails.log.error(e.stack);
    return res.serverError(e);
  }
}

export async function create(req, res) {
  sails.log(`=== API:${modelName}Controller:create ===`);
  try {
    const bodyData = req.param('data');
    const {
      langCode = res.langCode(),
    } = req.allParams();
    const include = [];
    include.concat([{"modelName":"User"},{"modelName":"Notification"}])
    const data = await QueryService.create({
      langCode,
      modelName,
      input: bodyData,
      include,
    }, {
      format: null,
      formatCb: null,
    });
    return res.ok({
      langCode,
      message,
      data,
    });
  } catch (e) {
    return res.error(e);
  }
}

export async function update(req, res) {
  sails.log(`=== API:${modelName}Controller:update ===`);
  try {
    const bodyData = req.param('data');
    const {
      id,
      langCode = res.langCode(),
    } = req.allParams();
    await QueryService.update({
      langCode,
      modelName,
      where: { id },
      input: bodyData,
      include: null,
    }, {
      format: null,
      formatCb: null,
      updateCb: null,
    });
    return await this.detail(req, res);
  } catch (e) {
    return res.error(e);
  }
}

export async function destroy(req, res) {
  sails.log(`=== API:${modelName}Controller:delete ===`);
  const ids = req.param('data');
  try {
    sails.log('delete ids=>', ids);
    const data = await QueryService.destroy({
      modelName,
      ids,
    });
    return res.ok({
      message,
      data,
    });
  } catch (e) {
    return res.error(e);
  }
}
