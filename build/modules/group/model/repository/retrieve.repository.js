import DatabaseManager from "../../../../database/database-manager.js";
export class RetrieveGroupRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "groups");
    }
    async handle(id, options) {
        const response = await this.databaseManager.retrieve(id, options);
        return {
            _id: response._id,
            ...response,
        };
    }
}
