const express = require("express");
const router = express.Router();
const genericController = require("./generic-controller");
const {
  associateRelation,
} = require("./middlewares/associate-relation-middleware");

router.get("/", associateRelation, genericController.findAll);

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
