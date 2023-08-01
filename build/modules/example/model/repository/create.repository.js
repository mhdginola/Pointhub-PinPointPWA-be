import DatabaseManager from "../../../../database/database-manager.js";
export class CreateExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(document, options) {
        return await this.databaseManager.create(document, options);
    }
}
