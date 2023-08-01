import DatabaseManager from "../../../../database/database-manager.js";
export class CreateInvitationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "invitations");
    }
    async handle(document, options) {
        return await this.databaseManager.create(document, options);
    }
}
