import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import React from 'react';
import serveHTML from "../utils/serveHTML";
import Login from '../pages/Login';
import User from '../db/Users';
import RegexTester from '../utils/regexTester';
import { generatePassword } from '../utils/authentication';

const users = express.Router();

users.route('/login')
    .post(passport.authenticate('local', {successRedirect: '/', failureRedirect: '/user/login'}))
    .get(async (req, res) => {
        const serverProps = {
            isAdmin: req.session.serverProps.isAdmin
        }
        res.status(200).send(serveHTML(<Login ServerProps={serverProps}/>, 'Login', serverProps));
    });

users.route('/logout')
    .get(async (req, res) => {
        req.logout(() => {
            res.redirect('/');
        });
    });

const userTest = new RegexTester({
    username: /[\w\ \.?!@]{1,100}/g,
    password: /[\w\ \.?!@]{1,100}/g
});

users.route('/register')
    .post(async (req, res) => {
        const parsedReq = userTest.runTest(req.body);
        if(typeof parsedReq == 'string') {
            res.send(parsedReq);
            return;
        }

        const typedReq = parsedReq as {
            username: string,
            password: string
        }

        const genPassword = generatePassword(typedReq.password);
        const user = {
            passportid: crypto.randomBytes(32).toString('hex'),
            username: typedReq.username,
            hash: genPassword.hash,
            salt: genPassword.salt,
            admin: true
        };
        
        if(await User.findOne({username: typedReq.username})) {
            res.send('Error: User already exists.'); 
            return;
        }

        User.create(user);
        res.send(true);
    })

export default users;