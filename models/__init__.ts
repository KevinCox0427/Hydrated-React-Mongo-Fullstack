import { userTable } from "./user";
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initalizing the conneciton to the postgres database.
 */
export const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.sqlHost,
        port: process.env.sqlPort,
        user: process.env.sqlUser,
        password: process.env.sqlPass,
        database: process.env.sqlDatabase
    }
});

/**
 * A function to see if any tables are missing from the database.
 * If so, it will create all the tables necessary for the application.
 * 
 * @returns A boolean representing whether the operation of creating / checking the tables are a success.
 */
const initializeTableSchemas = async () => {
    /**
     * Checking to see if the table exists. If not, create it with the provided schema.
     */
    const createAllTables = (await Promise.all(Object.keys(tableSchemas).map(tableName => { 
        return new Promise<boolean>(async (resolve) => {
            if(!(await knex.schema.hasTable(tableName) as boolean)) {
                resolve(knex.schema.createTable(tableName, tableSchemas[tableName as keyof typeof tableSchemas]) as boolean);
            } else {
                resolve(true);
            }
        });
    }))).every(success => success);

    isDBready = true;

    /**
     * Returning the success of the operation.
     */
    return createAllTables;
}

/**
 * Table schemas with their schema names.
 */
const tableSchemas = {
    user: userTable
} 

export let isDBready = false;
initializeTableSchemas();