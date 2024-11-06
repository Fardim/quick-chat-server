const router = require('express').Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req,res) => {
    try {
        // 1. if user already exist
        const existingUser = await User.findOne({email: req.body.email});
        
        // 2 if user exists, send an error response
        if(existingUser) {
            return res.send({
                message: 'User already exist',
                success: false
            });
        }
        
        // 3. encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // create the new user, save in DB
        const newUser = await new User(req.body);
        await newUser.save();

        res.status(201).send({
            message: 'User created successfully',
            success: true
        });

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        // 1. check if user exist
        const existingUser = await User.findOne({email: req.body.email}).select('password');
        if(!existingUser) {
            return res.send({
                message: 'User does not exist',
                success: false
            });
        }

        // 2. check if password is correct
        const isValid = await bcrypt.compare(req.body.password, existingUser.password);
        if(!isValid) {
            return res.send({
                message: 'Invalid password',
                success: false
            });
        }

        // 3. if user exist and password exists, assign a jwt
        const token = jwt.sign({userId: existingUser._id, email: existingUser.email}, process.env.SECRET_KEY, {expiresIn: '1d'});
        
        res.send({
            message: 'user logged in successfully',
            success: true,
            token: token
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;