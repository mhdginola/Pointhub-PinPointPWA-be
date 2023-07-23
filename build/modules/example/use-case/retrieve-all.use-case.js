import { RetrieveAllExampleRepository } from "../model/repository/retrieve-all.repository.js";
export class RetrieveAllExampleUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(query, options) {
        try {
            const response = await new RetrieveAllExampleRepository(this.db).handle(query, options);
            return {
                examples: response.data,
                pagination: response.pagination,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
