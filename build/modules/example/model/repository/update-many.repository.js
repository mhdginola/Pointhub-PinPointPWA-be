import DatabaseManager from "../../../../database/database-manager.js";
export class UpdateManyExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(filter, document, options) {
        return await this.databaseManager.updateMany(filter, document, options);
    }
}
