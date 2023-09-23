const { Op } = require("sequelize");

exports.buildQuery = (req, res, next) => {
  let queries = {};
  if (req.queryOptions.where) {
    let query = Object.create(req.queryOptions.where);
    for (key in query) {
      if (typeof query[key] === "string") {
        queries[key] = {
          [Op.like]: `%${query[key]}%`,
        };
      } else {
        queries[key] = query[key];
      }
    }
  }

  req.queryOptions.where = queries;

  next();
};
