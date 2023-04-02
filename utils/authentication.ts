import { Request, Response, NextFunction } from "express";
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

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
    if (user && verifyPassword(user.salt, user.hash, password)) {
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


export function generatePassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('base64');
    return {
        salt: salt,
        hash: hash
    }
}

function verifyPassword(salt:string, hashedPassword:string, inputPassword:string) {
    const inputHashBuffer = scryptSync(inputPassword, salt, 64);
    const savedHashBuffer = Buffer.from(hashedPassword, 'base64');
    return timingSafeEqual(inputHashBuffer, savedHashBuffer);
}

export function isAuth ( req:Request, res:Response, next:NextFunction ) {
    if(req.isAuthenticated()) { next() }
    else res.status(302).redirect('/user/login');
};

export function isAdmin ( req:Request, res:Response, next:NextFunction ) {
    if(req.isAuthenticated() && req.user.admin) { next() }
    else res.status(302).redirect('/user/login');
}