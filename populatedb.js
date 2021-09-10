#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var categories = [];

function categoryCreate(name, description, cb) {
  categorydetail = { name };
  if (description != false) categorydetail.description = description;
  const category = new Category(categorydetail);
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}
function itemCreate(name, description, category, price, qtyInStock, cb) {
  itemdetail = { name, price, category, qtyInStock };
  if (description != false) itemdetail.description = description;
  // if (category != false) itemdetail.category = category;

  var item = new Item(itemdetail);

  item.save(function (err) {
    if (err) {
      console.log("ERROR CREATING item");
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("Dog", "Your loyal companion", callback);
      },
      function (callback) {
        categoryCreate("Cat", "Lovely meow", callback);
      },
    ],
    cb
  );
}

function createItems(cb) {
  // Description taken from https://www.thesprucepets.com/personalities-of-popular-cat-breeds-554219 and https://www.thesprucepets.com/best-dogs-for-protection-4140197
  const description = {
    siamese:
      "Popular since the 19th century, this cat breed originated in Thailand (formerly known as Siam). The Siamese has been a foundational breed for the Oriental shorthair, sphynx, and Himalayan. Most Siamese cats have distinct markings called points that are the areas of coloration on their face, ears, feet, and tail.",
    persian:
      "Also lovingly referred to as one of the smushed-face cats, the Iranian cat or Shiraz cat (named for a city in Iran), Persians have beautiful, long fur coats. They can come in almost any color and have a flat face when compared to most other breeds of cats.",
    "maine coon":
      "Known for its large stature and thick fur coat, the Maine coon is a cat that is difficult to ignore. Hailing from the state of Maine and the state’s official cat, the Maine coon is a gentle giant. They are great hunters and were popularized after the CFA recognized them as purebred in the late 1970s. ",
    ragdoll:
      "Ragdoll cats get their name from their docile temperament. They tend to go limp when picked up, much like a rag doll. At one time, people thought they couldn’t feel pain, but that is not true. Ragdolls look a lot like long-haired Siamese cats with pointed color patterns. They also have distinctive blue eyes and dog-like personalities, following their owners around the house. ",
    akita:
      "Akitas are one of the most loyal dog breeds. Bred for guarding royalty and nobility in feudal Japan, this courageous and alert breed is naturally suspicious of strangers. Akitas will keep watch over you and your family at all times. This breed takes this task seriously and will typically perform its guarding duty with little to no training",
    "belgian malinois":
      "Intense and athletic, the Belgian Malinois is a favorite breed of police and military K-9 units for its agility, search and rescue abilities, and trainability. This dog has a high energy level and thrives when it has a job to perform. It must get specialized training and proper socialization to be at ease in new or unfamiliar situations. This dog must get plenty of exercise every day.",
    bullmastiff:
      "Gamekeepers initially developed the loyal and brave bullmastiff to protect their game from poachers. The bullish looks of this large breed can be intimidating to intruders. In actuality, this dog is naturally affectionate towards its family, making it an excellent companion.",
    "cane corso":
      'The cane corso (pronounced "KAH-nay KOR-so") is an Italian dog breed historically used as a guard dog, war dog, and hunter. Its large size, heavy build, and deep-toned bark help ward off trespassers. The breed possesses an instinct for guarding. Its training should focus on obedience and honing its natural skills.',
    "german sheperd":
      "Similar in looks and temperament to the Belgian Malinois, the German shepherd is another intense, active breed also favored as a police or military working dog. This breed exhibits a deep sense of loyalty toward its family members. Just like other protective dogs, training is critical to keep these dogs focused on being guard dogs. You will need to socialize your German shepherd to avoid fearfulness and nervousness.",
  };
  async.series(
    [
      function (callback) {
        itemCreate(
          "Siamese",
          description.siamese,
          categories[1],
          20,
          10,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Persian",
          description.persian,
          categories[1],
          10,
          4,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Maine Coon",
          description["maine coon"],
          categories[1],
          12,
          2,
          callback
        );
      },
      function (callback) {
        itemCreate("Akita", description.akita, categories[0], 13, 4, callback);
      },
      function (callback) {
        itemCreate(
          "Belgian Malinois",
          description["belgian malinois"],
          categories[0],
          13,
          4,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Bullmastif",
          description.bullmastif,
          categories[0],
          13,
          4,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Cane Corso",
          description["cane corso"],
          categories[0],
          13,
          4,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "German Sheperd",
          description["german sheperd"],
          categories[0],
          13,
          4,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("success");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
