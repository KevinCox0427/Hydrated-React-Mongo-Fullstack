import { Request, Response, NextFunction } from "express";
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import crypto from 'crypto';

import User from '../db/Users';
import { app } from '../server';

declare global {
    namespace Express {
        interface Partial<SessionData> {
            passport?: {
                user?: string
            },
            serverProps: ServerPropsType
        }
    }
}

passport.use(new LocalStrategy({
    usernameField: 'username', 
    passwordField: 'password'
}, async (username, password, done) => {
    const user = await User.findOne({ username: username });
    if (user && user.hash === crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex')) {
        return done(null, user);
    }
    return done(null, null);
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    const id = user._id;
    done(null, id);
});
passport.deserializeUser(async (userID:string, done) => {
    const user = await User.findOne({_id: userID});
    if(user) done(null, user);
    else done(null, null);
});

app.use((req, res, next) => {
    if(req.session.passport?.user) req.session.serverProps = {...req.session.serverProps, isAdmin: true};
    else req.session.serverProps = {...req.session.serverProps, isAdmin: false};  
    req.session.save();
    next();
});

function isAuth ( req:Request, res:Response, next:NextFunction ) {
    if(req.isAuthenticated()) { next() }
    else res.status(302).redirect('/user/login');
};

function isAdmin ( req:Request, res:Response, next:NextFunction ) {
    if(req.isAuthenticated() && req.user.admin) { next() }
    else res.status(302).redirect('/user/login');
}

export { isAdmin, isAuth };