var app = require("express");
var router = app.Router();
var { User, Thought } = require("../../models");

// GET all users
// GET /api/users
router.get("/", async(req, res) => {
    let retUsers = await User.find({}).select("-__v").populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" });
    // let retUsers = await User.find({});
    res.json(retUsers);
});

// POST a new user
// POST /api/users
router.post("/", async(req, res) => {
    // Create new user testUserNewByRoute
    let retUser = await User.create({ username: req.body.username, email: req.body.email }).catch(err => {
        if (err.code === 11000) {
            var duplicateKey = Object.keys(err.keyValue)[0];
            var duplicateVal = err.keyValue[duplicateKey];
            err = `Unable to create because ${duplicateKey} '${duplicateVal}' already taken`;
        }
        res.status(500).json({ message: err, error: 1 });
    })
    res.json(retUser);
});

// GET a single user by its \_id and populate its thought and friend data
// GET /api/users/:userId
router.get("/:userId", async(req, res) => {
    let retUser = await User.findOne({
        _id: req.params.userId
    }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
    res.json(retUser);
});

// PUT to update a user by its _id
// PUT /api/users/:userId
router.put("/:userId", async(req, res) => {
    let retUser = await User.findOneAndUpdate({
        _id: req.params.userId
    }, { email: req.body.email }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
    res.json(retUser);
});

// DELETE to remove user by its _id
// DELETE /api/users/:userId
router.delete("/:userId", async(req, res) => {
    let retUser = await User.findOneAndDelete({
        _id: req.params.userId
    }).select("-__v");
    res.json({ message: "Deleted user", user: retUser });
});

// POST to add a new friend to a user's friend list
// POST /api/users/:userId/friends/:friendId
router.post("/:userId/friends/:friendId", async(req, res) => {
    let retUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
    res.json(retUser);
});

// DELETE to remove a friend from a user's friend list
// DELETE /api/users/:userId/friends/:friendId
router.delete("/:userId/friends/:friendId", async(req, res) => {
    let retUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
    res.json({ message: "Deleted friend and updated the friend list of the associated user", user: retUser });
});

module.exports = router;