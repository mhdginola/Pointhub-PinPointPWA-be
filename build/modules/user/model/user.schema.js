import { MongoDBHelper } from "../../../database/mongodb/mongodb-helper.js";
export const collection = "users";
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
            required: ["username"],
            properties: {
                username: {
                    bsonType: "string",
                    description: "The username for the user",
                },
                role: {
                    bsonType: "string",
                    description: "The role for the user",
                },
            },
        });
        console.info(`[schema] ${collection} - create unique attribute "username"`);
        await helper.createUnique(collection, {
            username: -1,
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
