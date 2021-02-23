const router = require('express').Router();

// Combine routes
const userRoutes = require('./user-routes');
const friendRoutes = require('./friend-routes');
const thought = require('./thought-routes');
const reaction = require('./reaction-routes');

router.use('/users', userRoutes);
router.use('/thoughts', thought);

module.exports = router;