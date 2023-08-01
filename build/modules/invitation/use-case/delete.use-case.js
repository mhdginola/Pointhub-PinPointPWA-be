import { DeleteInvitationRepository } from "../model/repository/delete.repository.js";
export class DeleteInvitationUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        try {
            const response = await new DeleteInvitationRepository(this.db).handle(id, options);
            return {
                acknowledged: response.acknowledged,
                deletedCount: response.deletedCount,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
