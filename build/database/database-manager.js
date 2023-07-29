export default class DatabaseManager {
    constructor(databaseConnection, collectionName) {
        this.databaseConnection = databaseConnection;
        this.collectionName = collectionName;
    }
    collection() {
        return this.databaseConnection.collection(this.collectionName);
    }
    async create(document, options) {
        return await this.collection().create(document, options);
    }
    async createMany(documents, options) {
        return await this.collection().createMany(documents, options);
    }
    async retrieve(id, options) {
        return await this.collection().retrieve(id, options);
    }
    async retrieveAll(query, options) {
        return await this.collection().retrieveAll(query, options);
    }
    async update(id, document, options) {
        return await this.collection().update(id, document, options);
    }
    async updateMany(filter, document, options) {
        return await this.collection().updateMany(filter, document, options);
    }
    async delete(id, options) {
        return await this.collection().delete(id, options);
    }
    async deleteMany(filter, options) {
        return await this.collection().deleteMany(filter, options);
    }
    async aggregate(pipeline, query, options) {
        return await this.collection().aggregate(pipeline, query, options);
    }
}
