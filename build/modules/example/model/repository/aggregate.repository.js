import DatabaseManager from "../../../../database/database-manager.js";
export class AggregateExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async aggregate(pipeline, query, options) {
        return await this.databaseManager.aggregate(pipeline, query, options);
    }
}
