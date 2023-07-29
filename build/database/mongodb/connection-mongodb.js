import { ApiError } from "@point-hub/express-error-handler";
import { fileSearch } from "@point-hub/express-utils";
import { MongoClient, ObjectId, MongoServerError, } from "mongodb";
import MongoError from "./mongodb-error-handler.js";
import { replaceObjectIdToString, replaceStringToObjectId } from "./mongodb-helper.js";
import { fields, limit, page, skip, sort } from "./mongodb-querystring.js";
export default class MongoDbConnection {
    constructor(config) {
        const options = {};
        this.config = config;
        this.client = new MongoClient(this.url(), options);
    }
    url() {
        return this.config.url ?? "";
    }
    /**
     * Open connection to connect the client to the server (optional starting in v4.7)
     * https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/
     */
    async open() {
        await this.client.connect();
    }
    async close() {
        await this.client.close();
    }
    database(name, options) {
        this._database = this.client.db(name, options);
        return this;
    }
    async listCollections() {
        if (!this._database) {
            throw new Error("Database not found");
        }
        return await this._database.listCollections().toArray();
    }
    collection(name, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        this._collection = this._database.collection(name, options);
        return this;
    }
    async createIndex(name, spec, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.createIndex(name, spec, options);
    }
    async updateSchema(name, schema) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.command({
            collMod: name,
            validator: {
                $jsonSchema: schema,
            },
        });
    }
    async createCollection(name, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.createCollection(name, options);
    }
    async dropCollection(name, options) {
        if (!this._database) {
            throw new Error("Database not found");
        }
        await this._database.dropCollection(name, options);
    }
    async createCollections() {
        const object = await fileSearch("/*.schema.ts", "./src/modules", { maxDeep: 2, regExp: true });
        for (const property in object) {
            const path = `../../modules/${object[property].path.replace("\\", "/").replace(".ts", ".js")}`;
            const { createCollection } = await import(path);
            await createCollection(this);
        }
    }
    async dropCollections() {
        const object = await fileSearch("/*.schema.ts", "./src/modules", { maxDeep: 2, regExp: true });
        for (const property in object) {
            const path = `../../modules/${object[property].path.replace("\\", "/").replace(".ts", ".js")}`;
            const { dropCollection } = await import(path);
            await dropCollection(this);
        }
    }
    async create(document, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        try {
            const insertOneOptions = options;
            insertOneOptions.writeConcern = {
                w: "majority",
            };
            const response = await this._collection.insertOne(replaceStringToObjectId(document), insertOneOptions);
            return {
                acknowledged: response.acknowledged,
                _id: response.insertedId.toString(),
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    async createMany(documents, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        try {
            const bulkWriteOptions = options;
            const response = await this._collection.insertMany(replaceStringToObjectId(documents), bulkWriteOptions);
            const ids = [];
            Object.values(response.insertedIds).forEach((val) => {
                ids.push(val.toString());
            });
            return {
                acknowledged: response.acknowledged,
                insertedCount: response.insertedCount,
                insertedIds: ids,
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    async retrieve(id, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const retrieveOptions = options;
        const result = await this._collection.findOne({
            _id: new ObjectId(id),
        }, retrieveOptions);
        if (!result) {
            throw new ApiError(404);
        }
        return replaceObjectIdToString(result);
    }
    async retrieveAll(query, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const retrieveOptions = options;
        const cursor = this._collection
            .find(query.filter ?? {}, retrieveOptions)
            .limit(limit(query.pageSize))
            .skip(skip(page(query.page), limit(query.pageSize)));
        if (sort(query.sort)) {
            cursor.sort(sort(query.sort));
        }
        if (fields(query.fields, query.excludeFields)) {
            cursor.project(fields(query.fields, query.excludeFields));
        }
        const result = await cursor.toArray();
        const totalDocument = await this._collection.countDocuments(query.filter ?? {}, retrieveOptions);
        return {
            data: replaceObjectIdToString(result),
            pagination: {
                page: page(query.page),
                pageCount: Math.ceil(totalDocument / limit(query.pageSize)),
                pageSize: limit(query.pageSize),
                totalDocument,
            },
        };
    }
    async update(id, document, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const updateOptions = options;
        try {
            const result = await this._collection.updateOne({ _id: new ObjectId(id) }, { $set: document }, updateOptions);
            return {
                acknowledged: result.acknowledged,
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount,
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    /**
     * Updates all documents that match the specified filter for a collection.
     * https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#examples
     */
    async updateMany(filter, updateFilter, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const updateManyOptions = options;
        try {
            const result = await this._collection.updateMany(filter, updateFilter, updateManyOptions);
            return {
                acknowledged: result.acknowledged,
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            };
        }
        catch (error) {
            if (error instanceof MongoServerError) {
                throw new MongoError(error);
            }
            throw error;
        }
    }
    async delete(id, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const deleteOptions = options;
        const result = await this._collection.deleteOne({
            _id: new ObjectId(id),
        }, deleteOptions);
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }
    /**
     * Removes all documents that match the filter from a collection.
     * https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/
     */
    async deleteMany(filter, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const deleteOptions = options;
        const result = await this._collection.deleteMany(replaceStringToObjectId(filter), deleteOptions);
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }
    async deleteAll(options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const deleteOptions = options;
        const result = await this._collection.deleteMany({}, deleteOptions);
        return {
            acknowledged: result.acknowledged,
            deletedCount: result.deletedCount,
        };
    }
    async aggregate(pipeline, query, options) {
        if (!this._collection) {
            throw new Error("Collection not found");
        }
        const aggregateOptions = options;
        const cursor = this._collection.aggregate([...pipeline, { $skip: (query.page - 1) * query.pageSize }, { $limit: query.pageSize }], aggregateOptions);
        const result = await cursor.toArray();
        const cursorPagination = this._collection.aggregate([...pipeline, { $count: "totalDocument" }], aggregateOptions);
        const resultPagination = await cursorPagination.toArray();
        const totalDocument = resultPagination.length ? resultPagination[0].totalDocument : 0;
        return {
            data: result,
            pagination: {
                page: page(query.page),
                pageCount: Math.ceil(totalDocument / limit(query.pageSize)),
                pageSize: limit(query.pageSize),
                totalDocument,
            },
        };
    }
    startSession() {
        this.session = this.client.startSession();
        return this.session;
    }
    async endSession() {
        await this.session?.endSession();
        return this;
    }
    startTransaction() {
        this.session?.startTransaction();
        return this;
    }
    async commitTransaction() {
        await this.session?.commitTransaction();
        return this;
    }
    async abortTransaction() {
        await this.session?.abortTransaction();
        return this;
    }
}
