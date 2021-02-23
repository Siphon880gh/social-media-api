const router = require('express').Router();

// Combine routes
const userRoutes = require('./user-routes');
const friendRoutes = require('./friend-routes');
const thought = require('./thought-routes');
const reaction = require('./reaction-routes');

router.use('/', userRoutes);
router.use('/', friendRoutes);
router.use('/', thought);
router.use('/', reaction);

module.exports = router;