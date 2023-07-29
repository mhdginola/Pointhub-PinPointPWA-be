import DatabaseManager from "../../../../database/database-manager.js";
export class CreateTagLocationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "tagLocations");
    }
    async handle(document, options) {
        return await this.databaseManager.create(document, options);
    }
}
