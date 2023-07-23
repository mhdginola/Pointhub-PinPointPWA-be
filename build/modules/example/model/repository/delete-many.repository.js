import DatabaseManager from "../../../../database/database-manager.js";
export class DeleteManyExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(filter, options) {
        return await this.databaseManager.deleteMany(filter, options);
    }
}
