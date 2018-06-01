const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const router = express.Router();

// @route  GET api/users/test
// @desc   Tests users route
// @access PUBLIC
router.get('/test', (req, res) => res.json({msg: 'Users works!'}));

// @route  POST api/users/register
// @desc   Register user
// @access PUBLIC
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) 
                return res.status(400).json({email: 'Email already exists.'});
            else {
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    }); 
                });
            }
        });
});

// @route  POST api/users/login
// @desc   Login user / Returning JWT
// @access PUBLIC
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({email: email})
        .then(user => {
            //Check user
            if(!user)
                return res.status(404).json({email: 'User not found!'});

            //Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        res.json({msg: 'Success'});
                    } else {
                        res.status(400).json({password: 'Password incorrect'});
                    }
                });
        });
});

module.exports = router;