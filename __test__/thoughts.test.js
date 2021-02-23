// Mongoose
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

// Models
var User = require('../models/User');
var Thought = require('../models/Thought');

beforeAll(async() => {
    // Connect to a Mongo DB with different database
    const url = `mongodb://127.0.0.1/socialmedia`
    await mongoose.connect(url, { useNewUrlParser: true });

    // Empty models
    User.deleteMany({}, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
    Thought.deleteMany({}, (err, result) => {
        if (err) {
            console.log(err);
        }
    });

    // Seed models
    const seeder = await require("./seed/thoughts");
    let context = await seeder.seed({ User, Thought });
    User = context.User;
    Thought = context.Thought;

    // Mock error json
    global.res = {};
    res.status = statusCode => {
        return {
            json: obj => {
                return obj;
            }
        }
    }
    res.json = obj => {
        return obj;
    }

    /**
     * Mock routers so once passed in the test later you can refactor into express routers
     * router.get/post/delete etc receives parameters
     * @param {string} uri api endpoint. Actual parameter placeholder in the api end point gets ignored.
     * @param {object} req object with optional key-value pairs such as params and body for mocking purposes
     * @param {callback} implementation(req) function that can use res.json, req, and expect. Do not pass values, just pass variable name req because it's a dependency injection. The res.json must be in a return statement like `return res.json(..)` so keep that in mind when refactoring into Handlebars Express routes
     */
    global.router = {};
    let routerMethod = async(uri, req, implementation) => {
        return implementation.call(null, req);
    }
    global.router.get = global.router.post = global.router.delete = global.router.update = global.router.put = routerMethod;
});

describe("Test Thoughts", () => {
    beforeAll(async function() {

        global.retUserTest = await User.findOne({ username: "testUser" })
            .select("-__v")
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });

        // For testing routes
        global.userId = retUserTest._id;
        global.thoughtId = retUserTest.thoughts[0]._id;
        // console.dir({ thoughtId });
    })
    test("Testing Thoughts", async function() {

        // console.log({ retUserTest })
        expect(retUserTest.thoughts.length).toEqual(1);
        expect(retUserTest.thoughts[0].thoughtText).toEqual("I am thinking of...");
    });
    test("Testing Thoughts: GET to get a single thought by its _id", async function() {

        // GET to get a single thought by its _id
        let retRouter = await router.get("/api/thoughts/:thoughtId", {
            params: {
                thoughtId
            }
        }, async(req) => {
            let retThought = await Thought.findOne({ _id: req.params.thoughtId });
            return res.json(retThought);
        });

        expect(retRouter.thoughtText).toEqual("I am thinking of...");
        // console.log(jsonObj);
    });
    test("Testing Thoughts: DELETE to remove a thought by its _id", async function() {

        // GET to get a single thought by its _id
        let retRouter = await router.delete("/api/thoughts/:thoughtId", {
            params: {
                thoughtId
            },
            body: {
                thoughtText: "I am thinking of another..."
            }
        }, async(req) => {
            let retThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { thoughtText: req.body.thoughtText }, { new: true });
            return res.json(retThought);
        });

        expect(retRouter.thoughtText).toEqual("I am thinking of another...");
        // console.log(jsonObj);
    });
    test("Testing Thoughts: DELETE to remove user by its _id", async function() {

        // GET to get a single thought by its _id
        let retRouter = await router.delete("/api/thoughts/:thoughtId", {
            params: {
                thoughtId
            }
        }, async(req) => {
            let retThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId }).then(async(deletedThought) => {
                if (!deletedThought)
                    return res.status(404).json({ message: "No comment with this id" });
                else {
                    let ownerOfDeletedThought = deletedThought.username;
                    let idOfDeletedThought = deletedThought._id;
                    // console.log({ deletedThought });
                    var cascader = await User.findOneAndUpdate({ username: ownerOfDeletedThought }, {
                        $pull: { thoughts: idOfDeletedThought }
                    }, { new: true })
                    return cascader;
                };
            }); // ^let retThought...

            return res.json(retThought);
        }); // router DELETE thought by _id

        // testUser's only thought is deleted
        // console.log(retRouter);
        expect(retRouter.username).toEqual("testUser");
        expect(retRouter.thoughts.length).toEqual(0);
    });
});

afterAll(async() => {
    // setTimeout(() => {

    mongoose.disconnect();
    // }, 1000);
})