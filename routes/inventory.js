var express = require("express");
var router = express.Router();

// Require controller node_modules
const item_controller = require("../controllers/itemController.js");
const category_controller = require("../controllers/categoryController.js");

// Homepage
router.get("/", category_controller.category_list);

// Category Routes
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);
router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);
router.get("/category/:id", category_controller.category_detail);
router.get("/category", category_controller.category_list);

// Item Routes
router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", item_controller.item_create_post);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/update", item_controller.item_update_post);
router.get("/item/:id", item_controller.item_detail);
router.get("/items", item_controller.item_list);

module.exports = router;
