const DB = require('../../models');

const getMedicine = async (req) => {
  let query = {
    limit: req.query.limit || 10,
    page: req.query.page || 1,
    sortKey: req.query.sortKey || 'name',
    sortOrder: req.query.sortOrder || 'asc',
  };

  let medicineList = await DB.medicine.findAndCountAll({
    offset: query.limit * (query.page - 1),
    limit: query.limit,
    order: [[query.sortKey, query.sortOrder]],
  });
  return {
    metaData: {
      page: query.page,
      perPage: query.limit,
      totalCount: medicineList.count,
      totalPage: Math.ceil(medicineList.count / query.limit),
      sortKey: query.sortKey,
      sortOrder: query.sortOrder,
    },
    records: medicineList.rows,
  };
};

const getSingleMedicine = async (req) => {
  return DB.medicine.findByPk(req.params.medicineId).then((result) => {
    if (!result) {
      throw new Error('Not Found!!');
    } else {
      return result;
    }
  });
};

const postMedicine = async (req) => {
  return await DB.medicine.create({ name: req.body.name });
};
const deleteMedicine = async (req) => {
  return DB.medicine.findByPk(req.params.medicineId).then((medicine) => {
    if (!medicine) {
      throw new Error('Not Found');
    }
    return medicine.destroy();
  });
};

const editMedicine = (req) =>
  DB.medicine.findByPk(req.params.medicineId).then((result) => {
    if (!result) {
      throw new Error('NOT FOUND');
    }
    return result.update({
      name: req.body.name,
    });
  });

module.exports = {
  getMedicine,
  postMedicine,
  getSingleMedicine,
  deleteMedicine,
  editMedicine,
};