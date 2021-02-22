module.exports = {
    seed: async function(User) {
        await User.create({ username: "test", email: Date.now() });
        await User.create({ username: "test2", email: Date.now() });
        await User.create({ username: "test3", email: Date.now() });
        return User;
    }
}