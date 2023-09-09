exports.associateRelation = (req, res, next) => {
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
