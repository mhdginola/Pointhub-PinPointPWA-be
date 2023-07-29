import { DeleteGroupRepository } from "../model/repository/delete.repository.js";
export class DeleteGroupUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        try {
            const response = await new DeleteGroupRepository(this.db).handle(id, options);
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
