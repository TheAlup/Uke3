const express = require("express");
const router = express.Router();

let familyTree = []; // Midlertidig lagring av familien i minnet

// CREATE: Legg til en ny person
router.post("/users", (req, res) => {
    console.log("POST request received at /users");
    console.log("Request body:", req.body);  // This will log the body of the request

    const { name, age } = req.body;
    const newPerson = {
        id: familyTree.length + 1,
        name,
        age,
        children: []
    };

    familyTree.push(newPerson);
    res.status(201).json(newPerson);
});



// READ: Hent hele familietreet
router.get("/", (req, res) => {
    res.json(familyTree);
});

// READ: Hent en person basert på ID
router.get("/:id", (req, res) => {
    const person = familyTree.find(p => p.id === parseInt(req.params.id));
    if (!person) {
        return res.status(404).json({ error: "Person ikke funnet" });
    }
    res.json(person);
});

// UPDATE: Oppdater en persons info
router.put("/:id", (req, res) => {
    const person = familyTree.find(p => p.id === parseInt(req.params.id));
    if (!person) {
        return res.status(404).json({ error: "Person ikke funnet" });
    }

    const { name, age } = req.body;
    if (name) person.name = name;
    if (age) person.age = age;

    res.json(person);
});

// DELETE: Slett en person
router.delete("/:id", (req, res) => {
    const personIndex = familyTree.findIndex(p => p.id === parseInt(req.params.id));
    if (personIndex === -1) {
        return res.status(404).json({ error: "Person ikke funnet" });
    }

    familyTree.splice(personIndex, 1);
    res.json({ message: "Person slettet" });
});

module.exports = router;
