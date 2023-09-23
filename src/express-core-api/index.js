const fs = require("fs");
const express = require("express");
const router = express.Router();
const endpoints = require("./generic-routes");
const sequelizeMiddleware =
  require("./middlewares/sequelize-middleware").middleware;

module.exports = function (modelsPath = "", options) {
  const generateRoutes =
    options.generateRoutes === undefined ? true : options.generateRoutes;
  verifyPath(modelsPath, generateRoutes);
  const models = getModels(modelsPath);
  const middlewares = addMiddlewares(options);

  if (generateRoutes) {
    if (models.length > 0) {
      models.forEach(function (file) {
        if (file.includes(".js")) {
          const modelName = file.replace(".js", "");
          if (
            options?.ignoreModels
              ? !options.ignoreModels.find((item) => item === modelName)
              : true
          ) {
            const model = require(`${modelsPath}/${file}`);
            const route = "/" + modelName;
            router.use(route, middlewares, function (req, res, next) {
              req.routeModel = {
                modelName: modelName,
                models: models,
                model: model,
                path: modelsPath,
              };
              return endpoints(req, res, next);
            });
          }
        }
      });
    }
  }

  return router;
};

function addMiddlewares(options) {
  router.use(sequelizeMiddleware);
  if (options?.middlewares?.length > 0) {
    options.middlewares.forEach((middleware) => {
      router.use(middleware);
    });
  }
  return router;
}

function verifyPath(modelsPath, generateRoutes) {
  if (generateRoutes) {
    if (!modelsPath) {
      throw Error(
        "Failed to create routes. You must provide the path to database entity models"
      );
    }
    if (typeof modelsPath == "undefined") {
      throw Error(
        "Failed to create routes. You must provide the path to database entity models"
      );
    }
  }
}

function getModels(modelsPath) {
  return fs.readdirSync(modelsPath);
}
