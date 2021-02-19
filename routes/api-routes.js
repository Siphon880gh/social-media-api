const router = require('express').Router();
var { User, Thought, Reaction } = require("../models")

// Mongo Shell commands
// https://docs.mongodb.com/manual/reference/mongo-shell/
/**
 * db.users.insertOne({username:"test"})
 * db.users.find()
 * 
 */

router.get("/", (req, res) => {

    var result = {};

    User.find({})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
})

module.exports = router;