var app = require("express");
var router = app.Router();
var { User, Thought } = require("../../models");

// GET to get all thoughts
// GET /api/thoughts
router.get("/", async(req, res) => {
    let retThought = await Thought.find({});
    res.json(retThought);
});

// POST to create a new thought (and push the created thought's _id to the associated user's thoughts array field)
// POST /api/thoughts
router.post("/", async(req, res) => {
    // Create a thought
    let retThought = await Thought.create({ thoughtText: req.body.thoughtText, username: req.body.username })
        .catch(err => { res.json({ error: 1, message: err }) });
    if (!retThought) {
        res.json({ message: "Cannot create thought.", error: 1 })
    }
    // Find the associated user
    // Then update the user by pushing the thought
    let newThoughtId = retThought._id;
    let retUser = await User.findOneAndUpdate({ username: req.body.username }, {
        $push: { thoughts: newThoughtId }
    }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");

    res.json(retUser)
});

// GET to get a single thought by its _id
// GET /api/thoughts/:thoughtId
router.get("/:thoughtId", async(req, res) => {
    let retThought = await Thought.findOne({ _id: req.params.thoughtId });
    res.json(retThought);
});

module.exports = router;