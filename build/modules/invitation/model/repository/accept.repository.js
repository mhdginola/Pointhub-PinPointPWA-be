import DatabaseManager from "../../../../database/database-manager.js";
export class AcceptInvitationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "invitations");
    }
    async handle(id, document, options) {
        return await this.databaseManager.update(id, document, options);
    }
}
