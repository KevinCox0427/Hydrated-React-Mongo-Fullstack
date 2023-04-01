/**
 * Loading environmental variables.
 */
import dotenv from 'dotenv';
dotenv.config();


/**
 * Initializing our express server.
 */
import express from "express";
export const app = express();


/**
 * Setting up server middleware and express sessions.
 */
import session from "express-session";
import connectMongoDBSession from 'connect-mongodb-session';

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('etag', false);


/**
 * Setting up a database for our express sessions.
 */
const MongoDBStore = connectMongoDBSession(session);
app.use(session({ 
    secret: process.env.SessionSecret || 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false, //change to true when hosting on https server
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: true
    },
    store: new MongoDBStore({
        uri: process.env.MongoURI || 'mongodb://127.0.0.1:27017',
        databaseName: process.env.DBName || 'Untitled',
        collection: 'User Sessions',
        expires: 1000 * 60 * 60 * 24
    })
}));


/**
 * Declare your server prop types.
 */
declare global { 
    type ServerPropsType = Partial<{
        isAdmin: boolean
    }>
}
export type { ServerPropsType };


/**
 * Import utility functions / middleware before your routes
 */
import './utils/authentication';


/**
 * Declare your routes
 */
import index from './routes/index';
import users from './routes/users';

app.use('/', index);
app.use('/user', users);


/**
 * Declaring static files in the assets folder.
 */
app.use('/assets', express.static('dist/public/assets'));
app.use('/css', express.static('dist/public/css'));
app.use('/js', express.static('dist/public/js'));


/**
 * Creating 404 route.
 */
import route404 from './routes/route404';
app.use('*', route404);


/**
 * Starting up the server.
 */
app.listen(process.env.PORT || 3000);