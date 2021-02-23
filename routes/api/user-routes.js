var app = require("express");
var router = app.Router();
var { User, Thought } = require("../../models");


// GET all users
router.get("/", async(req, res) => {
    let retUsers = await User.find({}).select("-__v").populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" });
    // let retUsers = await User.find({});
    res.json(retUsers);
});

// POST a new user
router.post("/", async(req, res) => {
    // Create new user testUserNewByRoute
    let retUser = await User.create({ username: req.body.username, email: req.body.email }).catch(err => {
        if (err.code === 11000) {
            err = "Unable to create because duplicate key is not allowed"
        }
        res.status(500).json({ message: err, error: 1 });
    })
    res.json(retUser);
});

// GET a single user by its \_id and populate its thought and friend data
router.get("/:userId", async(req, res) => {
    let retUser = await User.findOne({
        _id: req.params.userId
    }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
    res.json(retUser);
});

// PUT to update a user by its _id
router.put("/:userId", async(req, res) => {
    let retUser = await User.findOneAndUpdate({
        _id: req.params.userId
    }, { email: req.body.email }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
    res.json(retUser);
});



module.exports = router;