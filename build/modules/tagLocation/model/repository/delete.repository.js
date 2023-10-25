import DatabaseManager from "../../../../database/database-manager.js";
export class DeleteTagLocationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "tagLocations");
    }
    async handle(id, options) {
        return await this.databaseManager.delete(id, options);
    }
}
