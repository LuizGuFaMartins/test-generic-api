const express = require("express");
const router = express.Router();
const genericController = require("../controllers/generic-controller");
const {
  associateRelation,
} = require("../../middlewares/associate-relation-middleware");
const { buildQuery } = require("../../middlewares/build-query-middleware");

router.get("/", associateRelation, buildQuery, genericController.findAll);

router.post("/", genericController.create);

router.get("/:id", associateRelation, genericController.findById);

router.get(
  "/:id/:relation",
  associateRelation,
  genericController.findWithRelation
);

router.put("/:id", genericController.update);

router.delete("/:id", genericController.delete);

module.exports = router;
