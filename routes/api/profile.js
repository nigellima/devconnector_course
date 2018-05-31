const express = require('express');

const router = express.Router();

// @route  api/profile/test
// @desc   Tests profile routes
// @access PUBLIC
router.get('/test', (req, res) => res.json({msg: 'Profile works!'}));

module.exports = router;