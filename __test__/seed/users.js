module.exports = {
    seed: async function(User) {
        await User.create({ username: "testUser", email: "fake-email-" + Date.now() + "@fake-domain.com" });
        await User.create({ username: "testUser2", email: "fake-email-" + Date.now() + "@fake-domain.com" });
        await User.create({ username: "testUser3", email: "fake-email-" + Date.now() + "@fake-domain.com" });
        return User;
    }
}