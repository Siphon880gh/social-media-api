const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
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
        await User.findOneAndDelete({ username: "test3" }).then(deleteUserInfo => { /* console.log({ deleteUserInfo }); */ });
        retUsers = await User.find({});
        expect(retUsers.length).toEqual(2);
        // console.log({ retUsers });
    });
});

describe("Test Friend", () => {
    beforeAll(async function() {

        retUsers = await User.find({})
            .select("-__v")
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });
    })
    test("Testing friends", async function() {

        // Get ID
        let { _id } = await User.findOne({ username: "test2" });
        let newFriendId = _id;

        // See if is a valid object Id
        // expect(Types.ObjectId.isValid(newFriendId)).toEqual(true);

        // See if is a valid object Id: This also works
        // If a string is ObjectId, casting it to ObjectId will not change the string
        expect(newFriendId).toEqual(Types.ObjectId(newFriendId));

        await User.findOneAndUpdate({ username: "test" }, {
            $push: { friends: newFriendId }
        })

        // // Test that the user has a new friend
        let himAndHisFriend = await User.findOneAndUpdate({ username: "test" })
            .populate({ path: "friends", select: "-__v" })
            // expect(retUsers).toEqual(expect.any(Object));
            // expect(retUsers.length).toEqual(3);
            // expect(retUsers[0].username).toEqual("test");
            // console.log({ retUsers });
        console.log({ himAndHisFriend: JSON.stringify(himAndHisFriend) });
    });
});

afterAll(async() => {
    mongoose.disconnect();
})