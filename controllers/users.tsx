import express from 'express';
import passport from 'passport';
import React from 'react';
import serveHTML from "../utils/serveHTML";
import Login from '../views/Login';
import User from '../models/user';
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
            res.status(302).redirect('/');
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
            res.status(400).send(parsedReq);
            return;
        }

        const typedReq = parsedReq as {
            username: string,
            password: string
        }

        const genPassword = generatePassword(typedReq.password);

        const user = {
            username: typedReq.username,
            passHash: genPassword.hash,
            passSalt: genPassword.salt,
            admin: true
        };

        const previousUsers = await User.get({
            username: typedReq.username
        }, {
            amount: 1
        });
        
        if(previousUsers.length > 0) {
            res.status(400).send('Error: User already exists.'); 
            return;
        }

        User.create(user);

        res.status(200).send(true);
    })

export default users;