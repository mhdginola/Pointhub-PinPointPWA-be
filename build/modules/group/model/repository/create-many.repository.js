import DatabaseManager from "../../../../database/database-manager.js";
export class CreateManyGroupRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "groups");
    }
    async handle(documents, options) {
        return await this.databaseManager.createMany(documents, options);
    }
}
