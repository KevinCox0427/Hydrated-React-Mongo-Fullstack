import { isDBready, knex } from "./__init__";
import dotenv from 'dotenv';

dotenv.config();

/**
 * Declaring the types for the data structure of a user globally.
 */
declare global {
    interface UserType  {
        username: string,
        passHash: string,
        passSalt: string,
        admin: boolean
    }

    interface UserDoc extends UserType {
        id: number,
        createdAt: Date
    }
}

/**
 * The function for creating the SQL schema based on the typings above.
 */
export const userTable = (table:any) => {
    table.increments('id').primary();
    table.timestamp('createdAt').defaultTo(knex.fn.now(0));
    table.string('username');
    table.string('passHash');
    table.string('passSalt');
    table.boolean('admin');
}; 

/**
 * A user model object to implement CRUD operations.
 */
const User = {
    /**
     * A get operation using an id as a parameter.
     * 
     * @param id the id of the datatype.
     * @returns If successful, returns the datatype found. Otherwise returns false.
     */
    getByID: async (id:number): Promise<UserDoc | false> => {
        if(!isDBready) return false;

        const getResult = await knex('user')
            .where('id', id)
            .first();

        return getResult ? getResult : false;
    },

    /**
     * A get query using any amount of supplied information.
     * 
     * @param query (optional) Any data to query with.
     * @param options (optional) Can specify any amount of further options for the GET query.
     * Options include:
     *      amount: number  -  The number of users to return. Defaults to 20.
     *      offset: number  -  An offset amount to start the query. Defaults to 0.
     * @returns An array of found datatypes. Returns empty array if none found.
     */
    get: async (query: Partial<UserDoc> = {}, options?:Partial<{
        amount: number,
        offset: number
    }>): Promise<UserDoc[]> => {
        if(!isDBready) return [];
        
        const getResult = await knex('user')
            .where(query)
            /**
             * A function to conditionally add SQL clauses to the query.
             * This will be used to add our "options".
             */
            .modify((queryBuilder: any) => {
                if(options?.amount) {
                    queryBuilder.limit(1);
                }
                if(options?.offset) {
                    queryBuilder.offset(1);
                }
            })

        return getResult;
    },


    /**
     * A create operation for a user.
     * 
     * @param newUser The date to create the user with.
     * @returns If successful, returns the user's data structure. Otherwise return false.
     */
    create: async (newUser:UserType): Promise<UserDoc | false> => {
        if(!isDBready) return false;

        const createResult = await knex('user')
            .insert(newUser)
            .returning('*')
            .first();

        return createResult ? createResult : false;
    },

    /**
     * An update operation for the data type.
     * Overwrites the user with at the supplied id with any amount of supplied information.
     * 
     * @param id The id of the data type being overwritten
     * @param userData The pieces of data to overwrite with.
     * @returns If sucessful, returns the new data type that's been edited. Otherwise returns false.
     */
    update: async(id:number, userData:Partial<UserType>): Promise<UserDoc | false> => {
        if(!isDBready) return false;

        const updateResult = await knex('user')
            .where('id', id)
            .update(userData)
            .returning('*')
            .first();

        return updateResult ? updateResult : false;
    },

    /**
     * A delete operation for user(s) specified by the id.
     * 
     * @param id The id of the user(s).
     * @returns a boolean representing if the operation was successful.
     */
    delete: async(id: number | number[]): Promise<boolean> => {
        if(!isDBready) return false;

        const deletedUser = await knex('user')
            .where('id', id)
            .del();
        
        return deletedUser !== 0;
    }
}

export default User;
