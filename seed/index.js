const express = require('express');
const mongoose = require("mongoose");
const connect = require("../config/mongoose.js").start();

// Models
const { User, Thought, Reaction } = require("../models");

(async() => {
    // Empty models
    await User.deleteMany({}, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
    await Thought.deleteMany({}, (err, result) => {
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