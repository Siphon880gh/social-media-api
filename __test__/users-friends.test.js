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
    const seeder = await require("./seed/users");
    User = await seeder.seed(User);

    // Mock express response
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
     * @param {callback} implementation(req) function that can use res.json, req, and expect. Do not pass values, just pass variable name req because it's a dependency injection. The res.json must be in a return statement like `return res.json(..)` so keep that in mind when refactoring into Express routes
     */
    global.router = {};
    let routerMethod = async(uri, req, implementation) => {
        return implementation.call(null, req);
    }
    global.router.get = global.router.post = global.router.delete = global.router.update = global.router.put = routerMethod;
});

describe("Test User", () => {
    beforeAll(async function() {

        global.retUsers = await User.find({})
            .select("-__v")
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });
    })
    test("Testing Users", async function() {

        // Test that there are three users and that the most recently inserted is test3 (queue)
        expect(retUsers).toEqual(expect.any(Object));
        expect(retUsers.length).toEqual(3);
        expect(retUsers[0].username).toEqual("testUser");
        // console.log({ retUsers });
    });

    test("Testing Users: GET all users", async function() {

        let retRouter = await router.get("/api/users", {}, async(req) => {
            let retUsers = await User.find({}).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
            return res.json(retUsers);
        });

        // There are three users from seed/users
        expect(retRouter.length).toEqual(3);
    });
    test("Testing Users: POST a new user", async function() {

        let retRouter = await router.post("/api/users", {
            body: {

                username: "testUserNewByRoute",
                email: "fake-email-" + Date.now() + "@fake-domain.com"
            }

        }, async(req) => {
            // Create new user testUserNewByRoute
            let retUser = await User.create({ username: req.body.username, email: req.body.email }).then(newUser => newUser);
            return res.json(retUser);
        });

        // The new user is added
        // console.log({ retRouter });
        expect(retRouter.username).toBe("testUserNewByRoute");
    });
    test("Testing delete user", async function() {

        // Test that you can delete a user and the length goes from 3 to 2
        // If you had used deleteOne, then the resolved data is { deleteUserInfo: { n: 1, ok: 1, deletedCount: 1 } }
        // Using findOneAndDelete, then the resolved data is the row that's deleted
        expect(retUsers.length).toEqual(3);
        let deletingUser = await User.findOneAndDelete({ username: "testUser3" });
        if (!deletingUser) res.json({ error: "Account not found. Likely account terminated before deleting it. Likely the user terminated their own account or another administrator deleted the account already." });
        retUsers = await User.find({});
        expect(retUsers.length).toEqual(3);
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
    test("Testing Friends", async function() {

        // Get ID
        let requestingUser = await User.findOne({ username: "testUser" });
        if (!requestingUser) res.json({ error: "Account not found. Likely your account terminated before requesting a friendship. Likely you violated a terms of service. Please contact the administrator with your username." });
        let newFriendId = requestingUser._id;

        // See if is a valid object Id
        // expect(Types.ObjectId.isValid(newFriendId)).toEqual(true);

        // See if is a valid object Id: This also works
        // If a string is ObjectId, casting it to ObjectId will not change the string
        expect(newFriendId).toEqual(Types.ObjectId(newFriendId));

        let addingFriendToUser = await User.findOneAndUpdate({ username: "testUser" }, {
            $push: { friends: newFriendId }
        })
        if (!addingFriendToUser) res.json({ error: "Account not found. It's likely deleted before you can request friendship. Likely the user terminated their own account or the administrator did because of a terms of service violation." });

        // // Test that the user has a new friend
        // console.log({ himAndHisFriend: JSON.stringify(himAndHisFriend) });
        let himAndHisFriend = await User.findOneAndUpdate({ username: "testUser" });
    });
});

afterAll(async() => {
    mongoose.disconnect();
})