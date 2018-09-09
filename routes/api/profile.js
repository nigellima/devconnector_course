const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');

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

// @route  api/profile/
// @desc   POST create or edit profile
// @access PRIVATE
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('hey');
    const { errors, isValid } = validateProfileInput(req.body);
    
    //check validation
    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.skills) profileFields.skills = req.body.skills;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skills
    if(typeof req.body.skills !== 'undefined') 
        profileFields.skills = req.body.skills.split(',');

    //Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: profileFields.user })
        .then(profile => {
            if(profile) {
                console.log('foi aq?');
                //update existing profile
                Profile.findOneAndUpdate(
                    {user: profileFields.user}, 
                    { $set: profileFields }, 
                    { new: true})
                    .then(profile => res.json(profile));
            }
            else{
                //create
                Profile.findOne({ handle: profileFields.handle}).then(profile => {
                    errors.handle = 'That handle already existis';
                });

                new Profile(profileFields).save().then(profile => { res.json(profile)});
            }
        });
});

module.exports = router;