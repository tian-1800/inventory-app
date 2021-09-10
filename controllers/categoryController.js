const { body, validationResult } = require("express-validator");
const async = require("async");

const Category = require("../models/category.js");
const Item = require("../models/item");

exports.category_list = function (req, res, next) {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) return next(err);
      res.render("category_list", {
        title: "Inventory Home",
        category_list: list_categories,
      });
    });
};
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_detail", {
        category: results.category,
        items: results.category_items,
      });
    }
  );
};

exports.category_create_get = function (req, res) {
  res.render("category_form", { title: "Create Category" });
};
exports.category_create_post = [
  body("name", "Author Name Required").trim().isLength({ min: 1 }).escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req, res, next);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      category.save(function (err) {
        if (err) return next(err);
        res.redirect(category.url);
      });
    }
  },
];

exports.category_delete_get = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.category === null) res.redirect("/inventory/category_list");
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        items: results.category_items,
      });
    }
  );
};
exports.category_delete_post = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      item: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.item.length > 0) {
        res.render("category_delete", {
          title: results.category.name,
          category: results.category,
          items: results.item,
        });
      } else
        Category.findByIdAndRemove(
          req.body.categoryid,
          function deleteCategory(err) {
            if (err) return next(err);
            res.redirect("/inventory/category");
          }
        );
    }
  );
};

exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id).exec(function (err, category) {
    if (err) return next(err);
    if (category === null) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    res.render("category_update", {
      title: "Update Category",
      category: category,
    });
  });
};
exports.category_update_post = [
  body("name", "Author Name Required").trim().isLength({ min: 1 }).escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req, res, next);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, thecategory) {
          if (err) return next(err);
          res.redirect(thecategory.url);
        }
      );
  },
];
