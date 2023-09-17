const fs = require("fs");
const express = require("express");
const router = express.Router();
const endpoints = require("./generic/routes/generic-router");
const {
  auth,
} = require("./authentication/controllers/authentication-controller");
const authRouter = require("./authentication/routes/authentication-router");
const { verifyToken } = require("./middlewares/authentication-middleware");
const sequelizeMiddleware =
  require("./middlewares/sequelize-middleware").middleware;

module.exports = function (modelsPath = "", options) {
  options = verifyOptions(options);
  verifyPath(modelsPath, options.routes.generateRoutes);

  if (options.authentication.provide && options.models.useDefaultModels) {
    options.routes.middlewares = [...options.routes.middlewares, verifyToken];
    router.use(authRouter);
  }

  let models = getModels(modelsPath);
  const middlewares = addMiddlewares(options.routes.middlewares);

  if (options.routes.generateRoutes) {
    if (models.length > 0) {
      models = ignoreModels(models, options.models.ignoreModels);
      createModelsRoutes(models, middlewares, modelsPath);
    }

    if (options.models.useDefaultModels) {
      const defaultModelspath = __dirname + "/default-models";
      let defaultModels = getModels(defaultModelspath);
      defaultModels = ignoreModels(defaultModels, options.models.ignoreModels);
      createModelsRoutes(defaultModels, middlewares, defaultModelspath);
    }
  }

  return router;
};

function addMiddlewares(middlewares) {
  router.use(sequelizeMiddleware);
  if (middlewares?.length > 0) {
    middlewares.forEach((middleware) => {
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

function verifyOptions(options) {
  const defaultOptions = {
    routes: {
      generateRoutes: true,
      middlewares: [],
    },
    authentication: {
      provide: true,
      ignoreModels: [],
    },
    models: {
      useDefaultModels: true,
      ignoreModels: [],
    },
  };

  return mergeOptions(defaultOptions, options);
}

function mergeOptions(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof target[key] === "object" && typeof source[key] === "object") {
        target[key] = mergeOptions(target[key], source[key]);
      } else if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  }

  return target;
}
