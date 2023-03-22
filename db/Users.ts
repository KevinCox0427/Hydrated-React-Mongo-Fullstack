import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MongoURI || 'mongodb://127.0.0.1:27017');
client.connect();

declare global {
    namespace Express {
        interface User extends UserDoc { }
    }
}

interface User {
    username: string,
    hash: string,
    salt: string,
    admin: boolean
}

export interface UserDoc extends User {
    _id: string | ObjectId
}

const User = {
    find: async (query:Partial<UserDoc>) => {
        return await client.db(process.env.DBName || 'Untitled').collection<UserDoc>('Users').find(query);
    },
    findOne: async (query:Partial<UserDoc>) => {
        return await client.db(process.env.DBName || 'Untitled').collection<UserDoc>('Users').findOne(query);
    },
    create: async (newUser:User) => {
        return await client.db(process.env.DBName || 'Untitled').collection<User>('Users').insertOne(newUser);
    },
    edit: async(query:Partial<UserDoc>, newUser:User) => {
        return await client.db(process.env.DBName || 'Untitled').collection<UserDoc>('Users').replaceOne(query, newUser, {upsert: true});
    },
    delete: async(id: string) => {
        const result = await client.db(process.env.DBName || 'Untitled').collection<UserDoc>('Users').deleteOne({_id: new ObjectId(id)});
        return result.deletedCount > 0 ? id : null;
    }
}

export default User;
