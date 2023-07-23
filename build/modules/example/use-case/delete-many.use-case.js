import { DeleteManyExampleRepository } from "../model/repository/delete-many.repository.js";
export class DeleteManyExampleUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(listId, options) {
        try {
            const response = await new DeleteManyExampleRepository(this.db).handle({
                _id: {
                    $in: listId,
                },
            }, options);
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
