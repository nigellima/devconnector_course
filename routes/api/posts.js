const express = require('express');

const router = express.Router();

// @route  api/posts/test
// @desc   Tests posts routes
// @access PUBLIC
router.get('/test', (req, res) => res.json({msg: 'Posts works!'}));

module.exports = router;