var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  qtyInStock: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function () {
  return "/inventory/category/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
