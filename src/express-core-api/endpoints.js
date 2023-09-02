var express = require("express");
var router = express.Router();

const associateRelation = (req, res, next) => {
  let includes = [];
  if (req.queryOptions.include) {
    req.queryOptions.include.forEach((relation) => {
      req.routeModel.models.forEach((model) => {
        if (model.includes(relation)) {
          includes.push({
            model: require(`${req.routeModel.path}/${model}`),
          });
        }
      });
    });
  }
  req.queryOptions.include = includes;
  next();
};

router.get("/", associateRelation, function (req, res, next) {
  req.routeModel.model
    .findAll(req.queryOptions)
    .then(function (records) {
      if (records) return res.json(records);
      return next();
    })
    .catch(function (err, status) {
      res.json({ error: err.toString() });
    });
});

router.post("/", function (req, res, next) {
  req.routeModel.model
    .create(req.body)
    .then(function (record) {
      if (record) return res.json(record);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err });
    });
});

router.get("/:id", associateRelation, function (req, res, next) {
  req.routeModel.model
    .findById(req.params.id)
    .then(function (record) {
      if (record) return res.json(record);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
});

router.get("/:id/:relation", associateRelation, function (req, res, next) {
  var query = {};
  query[req.routeModel.modelName + "_" + "id"] = req.params.id;

  req.routeModel.models[req.params.relation]
    .findAll({
      where: query,
    })
    .then(function (records) {
      if (records) return res.json(records);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
});

router.put("/:id", function (req, res, next) {
  req.routeModel.model
    .findById(req.params.id)
    .then(function (record) {
      Object.assign(record, req.body);
      record.save();
      if (record) return res.json(record);
      return next();
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
});

router.delete("/:id", function (req, res, next) {
  req.routeModel.model
    .findById(req.params.id)
    .then(function (record) {
      record.destroy();
      res.json({ message: req.params.model + " destroyed" });
    })
    .catch(function (err) {
      res.json({ error: err.toString() });
    });
});

module.exports = router;
