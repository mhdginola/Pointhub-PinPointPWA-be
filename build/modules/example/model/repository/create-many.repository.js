import DatabaseManager from "../../../../database/database-manager.js";
export class CreateManyExampleRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "examples");
    }
    async handle(documents, options) {
        return await this.databaseManager.createMany(documents, options);
    }
}
