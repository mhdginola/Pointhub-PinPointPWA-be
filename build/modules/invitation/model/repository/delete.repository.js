import DatabaseManager from "../../../../database/database-manager.js";
export class DeleteInvitationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "invitations");
    }
    async handle(id, options) {
        return await this.databaseManager.delete(id, options);
    }
}
