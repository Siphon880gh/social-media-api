const express = require('express');
const mongoose = require("mongoose");
const connect = require("../config/mongoose.js").start();

// Models
const { User, Thought, Reaction } = require("../models");

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

// app.use(require('./routes'));

// app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));


(async() => {
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

    // Create users
    await User.create({ username: "testUser", email: "fake-email-" + Date.now() + "@fake-domain.com" });
    await User.create({ username: "testUser2", email: "fake-email-" + Date.now() + "@fake-domain.com" });
    await User.create({ username: "testUser3", email: "fake-email-" + Date.now() + "@fake-domain.com" });

    // Create a thought for testUser
    let thoughtId = await Thought.create({ username: "testUser", thoughtText: "I am thinking of..." });
    await User.findOneAndUpdate({ username: "testUser" }, {
        $push: { thoughts: thoughtId }
    });

    await mongoose.disconnect();
})();