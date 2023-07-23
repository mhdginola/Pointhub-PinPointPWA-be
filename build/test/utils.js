/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, ObjectId } from "mongodb";
import databaseConfig from "../config/database.js";
import { replaceObjectIdToString, replaceStringToObjectId } from "../database/mongodb/mongodb-helper.js";
export const resetDatabase = async () => {
    const client = await MongoClient.connect(databaseConfig[databaseConfig.default].url);
    const db = client.db(databaseConfig[databaseConfig.default].name);
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
        await db.collection(collection.name).deleteMany({});
    }
    client.close();
};
export const retrieve = async (collection, _id) => {
    const client = await MongoClient.connect(databaseConfig[databaseConfig.default].url);
    const db = client.db(databaseConfig[databaseConfig.default].name);
    const response = (await db.collection(collection).findOne({
        _id: new ObjectId(_id),
    }));
    client.close();
    return replaceObjectIdToString(response);
};
export const retrieveAll = async (collection, filter = {}) => {
    const client = await MongoClient.connect(databaseConfig[databaseConfig.default].url);
    const db = client.db(databaseConfig[databaseConfig.default].name);
    const response = await db.collection(collection).find(replaceStringToObjectId(filter)).toArray();
    client.close();
    return replaceObjectIdToString(response);
};
