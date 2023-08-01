import { MongoDBHelper } from "../../../database/mongodb/mongodb-helper.js";
export const collection = "invitations";
export async function createCollection(db) {
    try {
        const helper = new MongoDBHelper(db);
        if (!(await helper.isExists(collection))) {
            console.info(`[schema] ${collection} - create collection`);
            await db.createCollection(collection);
        }
        console.info(`[schema] ${collection} - update schema`);
        await db.updateSchema(collection, {
            bsonType: "object",
            required: ["email", "group"],
            properties: {
                email: {
                    bsonType: "string",
                    description: "The email for the invitation",
                },
                group: {
                    bsonType: "string",
                    description: "The group for the invitation",
                },
                accept: {
                    bsonType: "bool",
                    description: "The accept for the invitation",
                },
            },
        });
    }
    catch (error) {
        throw error;
    }
}
export async function dropCollection(db) {
    try {
        const helper = new MongoDBHelper(db);
        if (await helper.isExists(collection)) {
            await db.dropCollection(collection);
            console.info(`[schema] drop ${collection} collection`);
        }
    }
    catch (error) {
        throw error;
    }
}
