import DatabaseManager from "../../../../database/database-manager.js";
export class CreateUserRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "users");
    }
    async handle(document, options) {
        return await this.databaseManager.create(document, options);
    }
}
