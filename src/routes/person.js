const Person = require("../models/person");
const express = require("express");
const router = express.Router();
const { success } = require("../services/helper");

// http://localhost:5000/api/persons/new_add
// Ajout d'une nouvelle personne.
// PS ne pas laisser nos keys dans data: {...} si on ctrl+c / ctrl+v (json format)
router.post("/new_add", async (req, res) => {
  const person = new Person(req.body);
  const message = "A new person has just been added.";

  try {
    const savePerson = await person.save();
    res.status(201).send(success(message, savePerson));
  } catch (err) {
    res.status(400).send(err);
  }
});

// http://localhost:5000/api/persons/add_me
// Ajoute moi autant que tu veux.
router.post("/add_me", async (req, res) => {
  const person = new Person({
    name: "yassine",
    age: 24,
    favoriteFoods: ["pizza au saumon"],
  });
  const message = "You just added me.";

  try {
    const savePerson = await person.save();
    res.status(201).send(success(message, savePerson));
  } catch (err) {
    res.status(400).send(err);
  }
});

// http://localhost:5000/api/persons/add_many
// Ajout de plusieur personne.
router.post("/add_many", async (req, res) => {
  const arrayP = [
    { name: "zied", age: 30, favoriteFoods: ["burritos"] },
    { name: "mohamed", age: 20, favoriteFoods: ["pate"] },
    { name: "mamoun", age: 22, favoriteFoods: ["couscous", "poulet"] },
  ];
  const message = "Multiple people have been added.";

  try {
    const saveAll = await Person.insertMany(arrayP);
    res.status(201).send(success(message, saveAll));
  } catch (err) {
    res.status(400).send(err);
  }
});

// http://localhost:5000/api/persons
// Liste de toute les personnes
router.get("/", async (req, res) => {
  const message = "List of all people.";

  try {
    const persons = await Person.find({});
    if (!persons.length) {
      res
        .status(204)
        .send(console.info("There are no people in the database."));
    } else {
      res.send(success(message, persons));
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/name/:name
// Cherche toute les personne avec le même nom donné
router.get("/name/:name", async (req, res) => {
  const personsName = req.params.name;
  const message = `List of all people named ${personsName}.`;

  try {
    const persons = await Person.find({ name: personsName });
    if (!persons.length) {
      res.status(404).send(`There is no person named ${personsName}.`);
    } else {
      res.send(success(message, persons));
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/food/:favoriteFoods
// Cherche une personne par son favoriteFoods
router.get("/food/:favoriteFoods", async (req, res) => {
  const food = req.params.favoriteFoods;
  const message = `Here is a person who loves a ${food}.`;

  try {
    const person = await Person.findOne({ favoriteFoods: { $in: [food] } });
    !person
      ? res.status(404).send(`No person who loves a ${food} has been found.`)
      : res.send(success(message, person));
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/id/:id
// Cherche une personne par son ID
router.get("/id/:id", async (req, res) => {
  const personId = req.params.id;
  const message = "Here is the person with the corresponding ID.";

  try {
    const person = await Person.findById(personId);
    !person
      ? res.status(404).send("No person with the matching ID was found.")
      : res.send(success(message, person));
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/updateById/:id
// Mettre a jour une personne par son ID
// PS ne pas laisser se que l'on veut changer dans data: {...} si on ctrl+c / ctrl+v (json format)
router.put("/updateById/:id", async (req, res) => {
  const personId = req.params.id;
  const message = "The person has been updated.";

  try {
    const upPerson = await Person.findByIdAndUpdate(personId, req.body, {
      new: true,
    });
    !upPerson
      ? res.status(404).send("No person with the matching ID was found.")
      : res.send(success(message, upPerson));
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/updateByName/:name
// Mettre a jour une personne par son Nom
// PS ne pas laisser se que l'on veut changer dans data: {...} si on ctrl+c / ctrl+v (json format)
router.put("/updateByName/:name", async (req, res) => {
  const { name } = req.params;
  const message = "The person has been updated.";

  try {
    const upPerson = await Person.findOneAndUpdate({ name }, req.body, {
      new: true,
    });
    !upPerson
      ? res.status(404).send("No person with the matching Name was found.")
      : res.send(success(message, upPerson));
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/deleteById/:id
// Supprimer une personne par son ID
router.delete("/deleteById/:id", async (req, res) => {
  const personId = req.params.id;
  const message = "This person has been deleted.";

  try {
    const delPerson = await Person.findByIdAndDelete(personId);
    !delPerson
      ? res.status(404).send("No person with the matching ID was found.")
      : res.send(success(message, delPerson));
  } catch (err) {
    res.status(500).send(err);
  }
});

//http://localhost:5000/api/persons/deleteManyByName/:name
// Supprimer des personne par leur Nom
router.delete("/deleteManyByName/:name", async (req, res) => {
  const personsName = req.params.name;
  const message = "This person(s) have been deleted.";

  try {
    const delPersons = await Person.deleteMany({ name: personsName });
    !delPersons.deletedCount
      ? res.status(404).send("No person with the matching name was found.")
      : res.send(success(message, delPersons));
  } catch (err) {
    res.status(500).send(err);
  }
});

// http://localhost:5000/api/persons/special_search
// Cherche les deux première personne qui aime les burritos, les tri et n'affiche pas leur age.
router.get("/special_search", async (req, res) => {
  const message = "Here is the search result.";

  try {
    const people = await Person.find({ favoriteFoods: { $all: ["burritos"] } })
      .sort({ name: 1 })
      .limit(2)
      .select({ age: 0 })
      .exec(console.log("BURRITOS!!!"));
    people.length === 0
      ? res.status(404).send("Nobody likes burritos damage.")
      : res.send(success(message, people));
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
