import DatabaseManager from "../../../../database/database-manager.js";
export class RetrieveAllUserRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "users");
    }
    async handle(query, options) {
        return await this.databaseManager.retrieveAll(query, options);
    }
}
