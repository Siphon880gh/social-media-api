var app = require("express");
var router = app.Router();
var { User, Thought, Reaction } = require("../../models");

router.get("/users", async(req, res) => {
    let retUsers = User.find({ username: "testUser" }).select("-__v").populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" });
    // let retUsers = await User.find({});
    res.json(retUsers);
});

module.exports = router;