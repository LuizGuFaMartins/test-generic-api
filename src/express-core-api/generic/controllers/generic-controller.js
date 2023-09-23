exports.findAll = function (req, res, next) {
  req.routeModel.model
    .findAll(req.queryOptions)
    .then(function (data) {
      if (data) return res.json(data);
      return next();
    })
    .catch(function (err, status) {
      res.json({ error: err.toString() });
    });
};

exports.create = function (req, res, next) {
  req.routeModel.model
    .create(req.body)
    .then(function (record) {
      if (record) return res.json(record);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err });
    });
};

exports.findById = function (req, res, next) {
  req.routeModel.model
    .findByPk(req.params.id)
    .then(function (record) {
      if (record) return res.json(record);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
};

exports.findWithRelation = function (req, res, next) {
  const query = {};
  query[req.routeModel.modelName + "_" + "id"] = req.params.id;

  req.routeModel.models[req.params.relation]
    .findAll({
      where: query,
    })
    .then(function (data) {
      if (data) return res.json(data);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
};

exports.update = function (req, res, next) {
  req.routeModel.model
    .findByPk(req.params.id)
    .then(function (record) {
      Object.assign(record, req.body);
      record.save();
      if (record) return res.json(record);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
};

exports.delete = function (req, res, next) {
  req.routeModel.model
    .findByPk(req.params.id)
    .then(function (record) {
      record.destroy();
      res.json({ message: "Successfully deleted." });
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
};
