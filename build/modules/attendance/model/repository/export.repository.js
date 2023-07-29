import DatabaseManager from "../../../../database/database-manager.js";
export class ExportAttendanceRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "attendances");
    }
    async handle(query, options) {
        return await this.databaseManager.retrieveAll(query, options);
    }
}
