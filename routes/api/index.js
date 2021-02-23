const router = require('express').Router();

// Combine routes
const userRoutes = require('./user-routes');
const thought = require('./thought-routes');

router.use('/users', userRoutes);
router.use('/thoughts', thought);

module.exports = router;