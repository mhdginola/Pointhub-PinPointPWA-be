import DatabaseManager from "../../../../database/database-manager.js";
export class CreateManyUserRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "users");
    }
    async handle(documents, options) {
        return await this.databaseManager.createMany(documents, options);
    }
}
