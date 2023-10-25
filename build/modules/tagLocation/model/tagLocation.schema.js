import { MongoDBHelper } from "../../../database/mongodb/mongodb-helper.js";
export const collection = "tagLocations";
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
            required: ["location"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "The name for the tagLocation",
                },
                location: {
                    bsonType: "object",
                    properties: {
                        type: {
                            bsonType: "string",
                            enum: ["Point"],
                            description: "The type of GeoJSON object (should be 'Point')",
                        },
                        coordinates: {
                            bsonType: "array",
                            items: {
                                bsonType: "double",
                            },
                            description: "The coordinates of the point [longitude, latitude]",
                        },
                    },
                },
            },
        });
        console.info(`[schema] ${collection} - create 2dSphere attribute`);
        await helper.create2dSphere(collection, {
            "location.coordinates": "2dsphere",
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
