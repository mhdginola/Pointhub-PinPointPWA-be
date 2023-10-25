import DatabaseManager from "../../../../database/database-manager.js";
export class CreateManyTagLocationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "tagLocations");
    }
    async handle(documents, options) {
        return await this.databaseManager.createMany(documents, options);
    }
}
