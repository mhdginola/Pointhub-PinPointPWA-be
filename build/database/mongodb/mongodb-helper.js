import { isValid } from "date-fns";
import { ObjectId } from "mongodb";
/**
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/
 * https://www.mongodb.com/docs/manual/reference/collation/
 * https://www.mongodb.com/docs/manual/core/index-sparse/
 * https://www.mongodb.com/docs/manual/core/index-partial/
 */
export class MongoDBHelper {
    constructor(db) {
        this.db = db;
    }
    async createUnique(collection, properties) {
        await this.db.createIndex(collection, properties, {
            unique: true,
            collation: {
                locale: "en",
                strength: 2,
            },
        });
    }
    async createUniqueIfNotNull(collection, properties) {
        await this.db.createIndex(collection, properties, {
            unique: true,
            sparse: true,
            collation: {
                locale: "en",
                strength: 2,
            },
        });
    }
    async create2dSphere(collection, properties) {
        await this.db.createIndex(collection, properties, {
            unique: false,
            collation: {
                locale: "en",
                strength: 2,
            },
        });
    }
    async isExists(name) {
        const collections = (await this.db.listCollections());
        return collections.some(function (collection) {
            return collection.name === name;
        });
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const replaceStringToObjectId = (val) => {
    if (val == null)
        return null;
    if (Array.isArray(val)) {
        return val.map((item) => {
            return replaceStringToObjectId(item);
        });
    }
    else if (typeof val === "object" && !isValid(val)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(val).reduce((obj, key) => {
            const propVal = replaceStringToObjectId(val[key]);
            obj[key] = propVal;
            return obj;
        }, {});
    }
    else if (typeof val === "string" && ObjectId.isValid(val) && val === new ObjectId(val).toString()) {
        return new ObjectId(val);
    }
    return val;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const replaceObjectIdToString = (val) => {
    if (val == null)
        return null;
    if (Array.isArray(val)) {
        return val.map((item) => {
            return replaceObjectIdToString(item);
        });
    }
    else if (typeof val === "object" && ObjectId.isValid(val)) {
        return val.toString();
    }
    else if (typeof val === "object" && !isValid(val)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(val).reduce((obj, key) => {
            if (ObjectId.isValid(val) || isValid(val)) {
                return val.toString();
            }
            else {
                const propVal = replaceObjectIdToString(val[key]);
                obj[key] = propVal;
                return obj;
            }
        }, {});
    }
    return val;
};
