const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

// @route  api/profile/test
// @desc   Tests profile routes
// @access PUBLIC
router.get('/test', (req, res) => res.json({msg: 'Profile works!'}));

// @route  api/profile/
// @desc   GET current users profile
// @access PRIVATE
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors  = {};
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

module.exports = router;