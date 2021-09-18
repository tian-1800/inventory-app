var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
});

CategorySchema.virtual("url").get(function () {
  return "/category/" + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);
