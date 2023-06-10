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
 * Parsing all requests and responses to a JSON format.
 * Also encoding all URIs.
 */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('etag', false);


/**
 * Setting user sessions and the database to store them
 */
import session from "express-session";
import genFunc from 'connect-pg-simple';

const PostgresqlStore = genFunc(session);

app.use(session({ 
    secret: process.env.SessionSecret || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, //change to true when hosting on https server
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new PostgresqlStore({
        conString: process.env.pgConnectionString,
        createTableIfMissing: true
    })
}));


/**
 * Starting database configuration.
 */
import './db/__init';


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
import index from './controllers/index';
import users from './controllers/users';

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
import route404 from './controllers/route404';
app.use('*', route404);


/**
 * Starting up the server.
 */
app.listen(process.env.PORT || 3000);