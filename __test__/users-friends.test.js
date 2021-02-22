const mongoose = require('mongoose');
const { Schema } = mongoose;
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
    const seeder = await require("./seed/user");
    User = await seeder.seed(User);
});

describe("Test User", () => {
    beforeAll(async function() {

        retUsers = await User.find({})
            .select("-__v")
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });
    })
    test("Testing users", async function() {

        // Test that there are three users and that the most recently inserted is test3 (queue)
        expect(retUsers).toEqual(expect.any(Object));
        expect(retUsers.length).toEqual(3);
        expect(retUsers[0].username).toEqual("test");
        // console.log({ retUsers });
    });
    test("Testing delete user", async function() {

        // Test that you can delete a user and the length goes from 3 to 2
        // If you had used deleteOne, then the resolved data is { deleteUserInfo: { n: 1, ok: 1, deletedCount: 1 } }
        // Using findOneAndDelete, then the resolved data is the row that's deleted
        expect(retUsers.length).toEqual(3);
        await User.findOneAndDelete({ username: "test3" }).then(deleteUserInfo => { console.log({ deleteUserInfo }); });
        retUsers = await User.find({});
        expect(retUsers.length).toEqual(2);
        console.log({ retUsers });
    });
});

afterAll(async() => {
    mongoose.disconnect();
})