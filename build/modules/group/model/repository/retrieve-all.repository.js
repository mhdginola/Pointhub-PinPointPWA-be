import DatabaseManager from "../../../../database/database-manager.js";
export class RetrieveAllGroupRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "groups");
    }
    async handle(query, options) {
        return await this.databaseManager.retrieveAll(query, options);
    }
}
