const fs = require("fs");
const express = require("express");
const router = express.Router();
const routes = require("./generic-routes");
const sequelizeMiddleware =
  require("./middlewares/sequelize-middleware").middleware;

module.exports = function (modelsPath, options) {
  verifyPath(modelsPath);
  const models = getFilesModels(modelsPath);
  const middlewares = addMiddlewares(options);

  if (models.length > 0) {
    models.forEach(function (file) {
      if (file.includes(".js")) {
        const model = require(`${modelsPath}/${file}`);
        const modelName = file.replace(".js", "");
        const route = "/" + modelName;
        router.use(route, middlewares, function (req, res, next) {
          req.routeModel = {
            modelName: modelName,
            models: models,
            model: model,
          };
          return routes(req, res, next);
        });
      }
    });
  }

  return router;
};

// function addMiddlewares(middlewares) {
//   for (var i = 0; i < middlewares.length; i++) {
//     router.use(middlewares[i]);
//   }
//   return router;
// }

function addMiddlewares(options) {
  router.use(sequelizeMiddleware);
  if (options?.middlewares?.length > 0) {
    options.middlewares.forEach((middleware) => {
      router.use(middleware);
    });
  }
  return router;
}

function verifyPath(modelsPath) {
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

function getFilesModels(modelsPath) {
  return fs.readdirSync(modelsPath);
}
