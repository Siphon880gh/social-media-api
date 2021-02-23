module.exports = {
    seed: async function(context) {
        let { User, Thought } = context;
        await User.create({ username: "testUser", email: "fake-email-" + Date.now() + "@fake-domain.com" });
        await User.create({ username: "testUser2", email: "fake-email-" + Date.now() + "@fake-domain.com" });
        await User.create({ username: "testUser3", email: "fake-email-" + Date.now() + "@fake-domain.com" });

        let thoughtId = await Thought.create({ username: "testUser", thoughtText: "I am thinking of..." });
        await User.findOneAndUpdate({ username: "testUser" }, {
            $push: { thoughts: thoughtId }
        })

        return { User, Thought };
    }
}