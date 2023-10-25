import DatabaseManager from "../../../../database/database-manager.js";
export class AggregateTagLocationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "tagLocations");
    }
    async aggregate(pipeline, query, options) {
        return await this.databaseManager.aggregate(pipeline, query, options);
    }
}
