import { MongoDBHelper } from "../../../database/mongodb/mongodb-helper.js";
export const collection = "attendances";
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
            required: ["photo", "location"],
            properties: {
                group: {
                    bsonType: "string",
                    description: "The group for the attendance",
                },
                photo: {
                    bsonType: "string",
                    description: "The photo for the attendance",
                },
                location: {
                    bsonType: "array",
                    description: "The location for the attendance",
                },
                email: {
                    bsonType: "string",
                    description: "The email for the attendance",
                },
                groupName: {
                    bsonType: "string",
                    description: "The group name for the attendance",
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
