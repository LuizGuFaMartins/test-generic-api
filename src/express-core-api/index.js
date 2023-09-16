const fs = require("fs");
const express = require("express");
const router = express.Router();
const endpoints = require("./generic-router");
const { auth } = require("./authentication.controller");
const sequelizeMiddleware =
  require("./middlewares/sequelize-middleware").middleware;

module.exports = function (modelsPath = "", options) {
  const generateRoutes =
    options.generateRoutes === undefined ? true : options.generateRoutes;

  verifyPath(modelsPath, generateRoutes);

  const provideAuthentication =
    options.provideAuthentication === undefined
      ? true
      : options.provideAuthentication;
  provideAuthentication;

  const useDefaultModels =
    options.useDefaultModels === undefined ? true : options.useDefaultModels;

  let models = getModels(modelsPath);
  const middlewares = addMiddlewares(options);

  if (generateRoutes) {
    if (models.length > 0) {
      models = ignoreModels(models, options.ignoreModels);
      createModelsRoutes(models, middlewares, modelsPath);
    }

    if (useDefaultModels) {
      const defaultModelspath = __dirname + "/models";
      let defaultModels = getModels(defaultModelspath);
      defaultModels = ignoreModels(defaultModels, options.ignoreModels);
      createModelsRoutes(defaultModels, middlewares, defaultModelspath);
    }
  }

  if (provideAuthentication) {
    router.post("/auth", auth);
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
  return fs.readdirSync(modelsPath) || [];
}

function createModelsRoutes(models, middlewares, modelsPath) {
  models.forEach(function (file) {
    if (file.includes(".js")) {
      const modelName = file.replace(".js", "");
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
  });
}

function ignoreModels(models, ignore) {
  return models.filter((model) => {
    if (models.length ? !ignore.find((item) => item === modelName) : true) {
      return model;
    }
  });
}
