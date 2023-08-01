export default class DatabaseConnection {
    constructor(adapter) {
        this.adapter = adapter;
    }
    url() {
        return this.adapter.url();
    }
    async open() {
        await this.adapter.open();
    }
    async close() {
        await this.adapter.close();
    }
    database(name) {
        this.adapter.database(name);
        return this;
    }
    listCollections() {
        return this.adapter.listCollections();
    }
    collection(name) {
        this.adapter.collection(name);
        return this;
    }
    startSession() {
        this.adapter.startSession();
        return this.adapter.session;
    }
    async endSession() {
        await this.adapter.endSession();
        return this;
    }
    startTransaction() {
        this.adapter.startTransaction();
        return this;
    }
    async commitTransaction() {
        await this.adapter.commitTransaction();
        return this;
    }
    async abortTransaction() {
        await this.adapter.abortTransaction();
        return this;
    }
    createIndex(name, spec, options) {
        this.adapter.createIndex(name, spec, options);
    }
    async createCollection(name, options) {
        await this.adapter.createCollection(name, options);
    }
    async dropCollection(name, options) {
        await this.adapter.dropCollection(name, options);
    }
    async updateSchema(name, schema) {
        await this.adapter.updateSchema(name, schema);
    }
    /**
     * Create Collections
     * ==================
     * Create new collection if not exists and update schema validation or indexes
     */
    async createCollections() {
        await this.adapter.createCollections();
    }
    /**
     * Drop Collections
     * ==================
     * Drop collections function is for testing purpose, so every test can generate fresh database
     */
    async dropCollections() {
        await this.adapter.dropCollections();
    }
    async create(document, options) {
        return await this.adapter.create(document, options);
    }
    async createMany(documents, options) {
        return await this.adapter.createMany(documents, options);
    }
    async retrieve(id, options) {
        return await this.adapter.retrieve(id, options);
    }
    async retrieveAll(query, options) {
        return await this.adapter.retrieveAll(query, options);
    }
    async update(id, document, options) {
        return await this.adapter.update(id, document, options);
    }
    async updateMany(filter, document, options) {
        return await this.adapter.updateMany(filter, document, options);
    }
    async delete(id, options) {
        return await this.adapter.delete(id, options);
    }
    async deleteMany(filter, options) {
        return await this.adapter.deleteMany(filter, options);
    }
    async deleteAll(options) {
        return await this.adapter.deleteAll(options);
    }
    async aggregate(pipeline, query, options) {
        return await this.adapter.aggregate(pipeline, query, options);
    }
}
