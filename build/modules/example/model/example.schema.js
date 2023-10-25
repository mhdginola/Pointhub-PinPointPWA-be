import { MongoDBHelper } from "../../../database/mongodb/mongodb-helper.js";
export const collection = "examples";
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
            required: ["name", "firstName", "lastName"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "The name for the example",
                },
                firstName: {
                    bsonType: "string",
                    description: "The first name for the example",
                },
                lastName: {
                    bsonType: "string",
                    description: "The last name for the example",
                },
            },
        });
        console.info(`[schema] ${collection} - create unique attribute "name"`);
        await helper.createUnique(collection, {
            name: -1,
        });
        console.info(`[schema] ${collection} - create unique attribute for multiple column "firstName" and "lastName"`);
        await helper.createUnique(collection, {
            firstName: -1,
            lastName: -1,
        });
        console.info(`[schema] ${collection} - create unique attribute "optionalUniqueColumn" if the field is exists`);
        await helper.createUniqueIfNotNull(collection, {
            optionalUniqueColumn: -1,
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
