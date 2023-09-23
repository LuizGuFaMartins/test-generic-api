const restrictVars = ["include", "fields"];

const middleware = (req, res, next) => {
  try {
    req.queryOptions = {
      where: req.query.where
        ? JSON.parse(req.query.where)
        : removeRestrictWords(req.query),
      include: req.query.include ? JSON.parse(req.query.include) : undefined,
      attributes: getFieldAsArray(req.query.fields),
    };
  } catch (err) {
    return res.status(500).json({ error: "Invalid query exception" });
  }

  next();
};

const removeRestrictWords = (queries) =>
  Object.keys(queries)
    .filter((obj) => restrictVars.indexOf(obj) === -1)
    .reduce((obj, key) => {
      obj[key] = queries[key];
      return obj;
    }, {});

const getFieldAsArray = (field) => (field ? field.split(",") : undefined);

module.exports = {
  middleware,
  removeRestrictWords,
  getFieldAsArray,
};
