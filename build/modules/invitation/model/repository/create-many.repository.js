import DatabaseManager from "../../../../database/database-manager.js";
export class CreateManyInvitationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "invitations");
    }
    async handle(documents, options) {
        return await this.databaseManager.createMany(documents, options);
    }
}
