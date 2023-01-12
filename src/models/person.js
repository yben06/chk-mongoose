const mongoose = require("mongoose");

const Person = mongoose.model("person", {
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String], default: undefined },
});

module.exports = Person;
