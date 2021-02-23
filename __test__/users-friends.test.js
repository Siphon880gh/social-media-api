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

        // For testing routes
        global.userId = retUsers[0]._id;
        global.friendlyUserId = retUsers[1]._id;
        global.forgetablePersonUserId = retUsers[2]._id; // to test deleting
        // console.dir({ a: global.userId, b: global.friendlyUserId, c: global.forgetablePersonUserId })
    })
    test("Testing Users", async function() {

        // Test that there are three users and that the most recently inserted is test3 (queue)
        expect(retUsers).toEqual(expect.any(Object));
        expect(retUsers.length).toBe(3);
        expect(retUsers[0].username).toBe("testUser");
        // console.log({ retUsers });
    });

    test("Testing Users: GET all users", async function() {

        let retRouter = await router.get("/api/users", {}, async(req) => {
            let retUsers = await User.find({}).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
            return res.json(retUsers);
        });

        // There are three users from seed/users
        expect(retRouter.length).toBe(3);
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
    test("Testing Users: GET a single user by its _id and populate its thought and friend data", async function() {

        let retRouter = await router.get("/api/users:userId", {
            params: {
                userId: global.userId
            }
        }, async(req) => {
            let retUser = await User.findOne({
                _id: req.params.userId
            }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
            return res.json(retUser);
        });

        // Expect to get back the first seeded username from seed/users.js
        expect(retRouter.username).toBe("testUser");
    });
    test("Testing Users: PUT to update a user by its _id", async function() {

        let retRouter = await router.put("/api/users:userId", {
            params: {
                userId: global.userId
            },
            body: {
                email: "testUser@updated-domain.com"
            }
        }, async(req) => {
            let retUser = await User.findOneAndUpdate({
                _id: req.params.userId
            }, { email: req.body.email }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");
            return res.json(retUser);
        });

        // Expect testUser's email to be updated
        expect(retRouter.username).toBe("testUser");
        expect(retRouter.email).toBe("testUser@updated-domain.com");
    });
    test("Testing Users: DELETE to remove user by its _id", async function() {

        let retRouter = await router.delete("/api/users:userId", {
            params: {
                userId: global.forgetablePersonUserId
            }
        }, async(req) => {
            let retUser = await User.findOneAndDelete({
                _id: req.params.userId
            }).select("-__v");
            return res.json({ message: "Deleted user", user: retUser });
        });

        // Removed forgetable person testUser3 from seed/users
        expect(retRouter.user.username).toBe("testUser3");
        // console.log({ ret: retRouter });
    });
});

describe("Test Friends", () => {
    beforeAll(async function() {

        retUsers = await User.find({})
            .select("-__v")
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });
    });
    test("Testing Friends: POST to add a new friend to a user's friend list", async function() {

        let retRouter = await router.post("/api/users/:userId/friends/:friendId", {
            params: {
                userId: global.userId,
                friendId: global.friendlyUserId
            }
        }, async(req) => {
            let retUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");

            return res.json(retUser);
        });

        // The new friend is added
        expect(retRouter.username).toBe("testUser");
        expect(retRouter.friends[0].username).toBe("testUser2");
    });

    test("Testing Friends: DELETE to remove a friend from a user's friend list", async function() {

        let retRouter = await router.post("/api/users/:userId/friends/:friendId", {
            params: {
                userId: global.userId,
                friendId: global.friendlyUserId
            }
        }, async(req) => {
            let retUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true }).populate({ path: "thoughts", select: "-__v" }).populate({ path: "friends", select: "-__v" }).select("-__v");

            return res.json(retUser);
        });

        // The new friend is removed. The user has no friends now
        expect(retRouter.username).toBe("testUser");
        expect(retRouter.friends.length).toBe(0);
    });
});

afterAll(async() => {
    mongoose.disconnect();
})