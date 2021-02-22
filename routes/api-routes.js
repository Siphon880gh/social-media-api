var app = require("express");
var router = app.Router();
var { User, Thought, Reaction } = require("../models");

// Mongo Shell commands
// https://docs.mongodb.com/manual/reference/mongo-shell/
/**
 * db.users.insertOne({username:"test"})
 * db.users.find()
 * 
 */

// http://localhost:3001/api/test

router.get('/', (req, res) => {
    res.json({ reached: true });
})
router.get("/test", async function(req, res) {

    // await User.create({ username: "test2" }).then(() => {})
    // await User.save(() => {}); // probably not
    await User.find({})
        .populate("thoughts", "friends")
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
});

// async function testInTerminal(app) {
//     const request = require('supertest');
//     app.listen(3001, () => console.log(`🌍 Connected on localhost:3001`));

//     const response = await request(app).get('api/').send({ body: "test" });
//     console.log({ response });
// }
// testInTerminal(app);

module.exports = router;