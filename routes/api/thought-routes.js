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

// PUT to update a thought by its _id
// PUT /api/thoughts/:thoughtId
router.put("/:thoughtId", async(req, res) => {
    let retThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { thoughtText: req.body.thoughtText }, { new: true });
    res.json(retThought);
});

// DELETE to remove a thought by its _id
// DELETE /api/thoughts/:thoughtId
router.delete("/:thoughtId", async(req, res) => {
    let retUserAndThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId }).then(async(deletedThought) => {
        if (!deletedThought)
            res.status(404).json({ message: "No thought with this id. Did you delete more than once?", error: 1 });
        else {
            let ownerOfDeletedThought = deletedThought.username;
            let idOfDeletedThought = deletedThought._id;
            // console.log({ deletedThought });
            var cascader = await User.findOneAndUpdate({ username: ownerOfDeletedThought }, {
                $pull: { thoughts: idOfDeletedThought }
            }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
            return cascader;
        };
    }); // ^let retThought...

    res.json({ message: "Thought deleted and thought also deleted from associated user", user: retUserAndThought });
}); // router DELETE thought by _id

// POST to create a reaction stored in a single thought's reactions array field
// POST /api/thoughts/:thoughtId/reactions
router.post("/:thoughtId/reactions", async(req, res) => {
    let retThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, {
        $push: {
            reactions: {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            }
        }
    }, { new: true });

    res.json(retThought);
});

module.exports = router;