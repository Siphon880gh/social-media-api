module.exports = {
    seed: async function(User) {
        await User.create({ username: "testUser", email: Date.now() });
        await User.create({ username: "testUser2", email: Date.now() });
        await User.create({ username: "testUser3", email: Date.now() });
        return User;
    }
}