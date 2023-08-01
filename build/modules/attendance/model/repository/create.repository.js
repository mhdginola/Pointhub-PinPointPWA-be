import DatabaseManager from "../../../../database/database-manager.js";
export class CreateAttendanceRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "attendances");
    }
    async handle(document, options) {
        return await this.databaseManager.create(document, options);
    }
}
