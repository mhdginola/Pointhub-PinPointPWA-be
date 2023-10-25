import DatabaseManager from "../../../../database/database-manager.js";
export class UpdateExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(id, document, options) {
        return await this.databaseManager.update(id, document, options);
    }
}
