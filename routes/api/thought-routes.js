var app = require("express");
var router = app.Router();
var { User, Thought } = require("../../models");

// GET to get all thoughts
router.get("/", async(req, res) => {
    let retThought = await Thought.find({});
    res.json(retThought);
});

module.exports = router;