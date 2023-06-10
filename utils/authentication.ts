import { Request, Response, NextFunction } from "express";
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

import User from '../models/user';
import { app } from '../server';

/**
 * Declaration merging passport's and express's session objects so that it includes our own User's typing.
 */
declare global {
    namespace Express {
        interface Partial<SessionData> {
            passport?: {
                user?: UserDoc
            },
            serverProps: ServerPropsType
        }

        interface User extends UserDoc { }
    }
}


/**
 * Configuring login fields and it's callback function to verify such fields.
 */
passport.use(new LocalStrategy({
    usernameField: 'username', 
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    /**
     * Getting user by username from database.
     */
    const user = await User.get({
        username: username
    }, {
        amount: 1
    });

    /**
     * Guard clause if user is not found.
     */
    if(!user) return done(null, false);
    
    /**
     * Verifying their password against the stored hash.
     * If it passes, return the user, otherwise return a failure.
     */
    if (
        user[0].passHash && user[0].passSalt && 
        verifyPassword(user[0].passSalt, user[0].passHash, password)
    ) {
        return done(null, user[0]);
    }
    else return done(null, false);
}));


/**
 * Loading the login & session configuration into middleware.
 */
app.use(passport.initialize());
app.use(passport.session());


/**
 * Serialization function. We only want to store the id for our sessions in the database.
 */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/***
 * Deserialization funtion. Getting the user's id, and returning the user's data to attach to passport's session object.
 */
passport.deserializeUser(async (userID:number, done) => {
    /**
     * User's GET operation.
     */
    const user = await User.getByID(userID);
    /**
     * Returning if successful or not.
     */
    if(user) done(null, user);
    else done(null, false);
});


/**
 * A helper function to generate a type 9 hashed password
 * @param password the string password to encrypt.
 */
export function generatePassword(password: string) {
    /**
     * Generating a random salt
     */
    const salt = randomBytes(24).toString('base64');

    /**
     * Creating the hash with the salt and string password using scrypt.
     */
    const hash = scryptSync(password, salt, 64).toString('base64');

    return {
        salt: salt,
        hash: hash
    }
}

/**
 * A helper function to create a hash with an inputted password and verify it against the stored hash.
 * 
 * @param salt The stored salt that was created with the password
 * @param hashedPassword The hashed password stored in the database.
 * @param inputPassword The string passsword being inputted.
 * @returns A boolean representing whether it matches or not.
 */
function verifyPassword(salt:string, hashedPassword:string, inputPassword:string) {
    /**
     * Encrypting the inputted password.
     */
    const inputHashBuffer = scryptSync(inputPassword, salt, 64);
    /**
     * Converting the base64 hash into a buffer.
     */
    const savedHashBuffer = Buffer.from(hashedPassword, 'base64');
    /**
     * Using time safe equal to prevent against timing attacks.
     */
    return timingSafeEqual(inputHashBuffer, savedHashBuffer);
}


/**
 * Middleware function for protecting a route with a normal user
 */
export function isAuth ( req:Request, res:Response, next:NextFunction ) {
    if(req.isAuthenticated()) {
        next();
    }
    else res.status(302).redirect('/user/login');
};

/**
 * Middleware function for protecting a route with a admin user
 */
export function isAdmin ( req:Request, res:Response, next:NextFunction ) {
    if(req.isAuthenticated() && req.user.admin) {
        next()
    }
    else res.status(302).redirect('/user/login');
}