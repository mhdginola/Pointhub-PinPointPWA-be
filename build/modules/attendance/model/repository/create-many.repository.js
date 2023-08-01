import DatabaseManager from "../../../../database/database-manager.js";
export class CreateManyAttendanceRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "attendances");
    }
    async handle(documents, options) {
        return await this.databaseManager.createMany(documents, options);
    }
}
