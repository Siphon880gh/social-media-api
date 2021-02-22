const mongoose = require('mongoose');
const createIfNotExistsDb = "socialmedia";

module.exports = {
    start() {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/' + createIfNotExistsDb, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Use this to log mongo queries being executed!
        mongoose.set('debug', true);

        return mongoose;
    }
}