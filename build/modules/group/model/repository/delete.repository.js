import DatabaseManager from "../../../../database/database-manager.js";
export class DeleteGroupRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "groups");
    }
    async handle(id, options) {
        return await this.databaseManager.delete(id, options);
    }
}
