import { RetrieveAllGroupRepository } from "../model/repository/retrieve-all.repository.js";
export class RetrieveAllGroupUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(query, options) {
        try {
            const response = await new RetrieveAllGroupRepository(this.db).handle(query, options);
            return {
                groups: response.data,
                pagination: response.pagination,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
