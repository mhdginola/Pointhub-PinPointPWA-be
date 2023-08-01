import DatabaseManager from "../../../../database/database-manager.js";
export class DeleteExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(id, options) {
        return await this.databaseManager.delete(id, options);
    }
}
