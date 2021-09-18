const { body, validationResult } = require("express-validator");
// const async = require("async");

const Item = require("../models/item");

exports.item_list = function (req, res, next) {
  Item.find()
    .sort([["name", "ascending"]])
    .populate("category")
    .exec(function (err, list_items) {
      if (err) return next(err);
      res.render("item_list", {
        title: "Inventory Home",
        item_list: list_items,
      });
    });
};
exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) return next(err);
    if (item === null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    res.render("item_detail", {
      title: item.name,
      item: item,
    });
  });
};

exports.item_create_get = function (req, res) {
  res.render("item_form", { title: "Create Item" });
};
exports.item_create_post = [
  // Validation - Sanitation
  body("name", "Item Name Required").trim().isLength({ min: 1 }).escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be specified")
    .isNumeric()
    .custom((value) => {
      if (!value > 0) throw new Error("Price must be greater than zero");
      else return true;
    }),
  body("qtyInStock", "Quantity must be specified")
    .isNumeric()
    .custom((value) => {
      if (value < 0) throw new Error("Quantity in stock musn't be negative");
      else return true;
    }),

  // Process request
  (req, res, next) => {
    const errors = validationResult(req, res, next);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      qtyInStock: req.body.qtyInStock,
    });

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Create Item",
        item: item,
        errors: errors.array(),
      });
    } else
      item.save(function (err) {
        if (err) return next(err);
        res.redirect(item.url);
      });
  },
];

exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) return next(err);
    if (item.category === null) res.redirect("/inventory/item_list");
    res.render("item_delete", {
      title: "Delete Item",
      item: item,
    });
  });
};
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
    if (err) return next(err);
    res.redirect("/inventory/items");
  });
};

exports.item_update_get = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, results) {
    if (err) return next(err);
    if (results.item === null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    res.render("item_update", {
      title: "Update Item",
      item: results.item,
    });
  });
};
exports.item_update_post = [
  body("name", "Item Name Required").trim().isLength({ min: 1 }).escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be specified")
    .isNumeric()
    .custom((value) => {
      if (!value > 0) throw new Error("Price must be greater than zero");
      else return true;
    }),
  body("qtyInStock", "Quantity must be specified")
    .isNumeric()
    .custom((value) => {
      if (value < 0) throw new Error("Quantity in stock musn't be negative");
      else return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req, res, next);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      qtyInStock: req.body.qtyInStock,
    });
    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Create Item",
        Item: item,
        errors: errors.array(),
      });
    } else
      item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) return next(err);
        res.redirect(theitem.url);
      });
  },
];
