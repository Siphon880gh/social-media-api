var app = require("express");
var router = app.Router();
var { User, Thought } = require("../../models");

router.get("/", async(req, res) => {
    let retUsers = await User.find({}).select("-__v").populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" });
    // let retUsers = await User.find({});
    res.json(retUsers);
});

module.exports = router;