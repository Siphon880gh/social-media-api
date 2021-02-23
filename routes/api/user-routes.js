var app = require("express");
var router = app.Router();
var { User, Thought, Reaction } = require("../../models");

router.get("/", (req, res) => {
    res.json({ reached: true })
});

module.exports = router;