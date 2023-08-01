import { RetrieveAllTagLocationRepository } from "../model/repository/retrieve-all.repository.js";
export class RetrieveAllTagLocationUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(query, options) {
        try {
            const response = await new RetrieveAllTagLocationRepository(this.db).handle(query, options);
            return {
                tagLocations: response.data,
                pagination: response.pagination,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
