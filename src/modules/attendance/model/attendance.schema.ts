/**
 * MongoDB Schema
 *
 * https://www.mongodb.com/docs/v6.0/core/schema-validation/update-schema-validation/
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/
 */
import { IDatabaseAdapter } from "@src/database/connection.js";
import { MongoDBHelper } from "@src/database/mongodb/mongodb-helper.js";

export const collection = "attendances";

export async function createCollection(db: IDatabaseAdapter) {
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

    console.info(`[schema] ${collection} - create unique attribute "photo" and "location"`);
    await helper.createUnique(collection, {
      photo: -1,
      location: -1,
    });

    console.info(`[schema] ${collection} - create unique attribute "optionalUniqueColumn" if the field is exists`);
    await helper.createUniqueIfNotNull(collection, {
      optionalUniqueColumn: -1,
    });
  } catch (error) {
    throw error;
  }
}

export async function dropCollection(db: IDatabaseAdapter) {
  try {
    const helper = new MongoDBHelper(db);

    if (await helper.isExists(collection)) {
      await db.dropCollection(collection);
      console.info(`[schema] drop ${collection} collection`);
    }
  } catch (error) {
    throw error;
  }
}