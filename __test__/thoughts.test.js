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
    res.json = obj => {
        console.log(obj);
    }
});

describe("Test Thoughts", () => {
    beforeAll(async function() {

        global.retUserTest = await User.findOne({ username: "testUser" })
            .select("-__v")
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });
    })
    test("Testing Thoughts", async function() {

        // console.log({ retUserTest })
        expect(retUserTest.thoughts.length).toEqual(1);
        expect(retUserTest.thoughts[0].thoughtText).toEqual("I am thinking of...");
    });
});

afterAll(async() => {
    mongoose.disconnect();
})