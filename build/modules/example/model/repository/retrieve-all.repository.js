import DatabaseManager from "../../../../database/database-manager.js";
export class RetrieveAllExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(query, options) {
        return await this.databaseManager.retrieveAll(query, options);
    }
}
