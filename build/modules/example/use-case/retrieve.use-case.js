import { RetrieveExampleRepository } from "../model/repository/retrieve.repository.js";
export class RetrieveExampleUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        try {
            const response = await new RetrieveExampleRepository(this.db).handle(id, options);
            return {
                _id: response._id,
                name: response.name,
                status: response.status,
                createdAt: response.createdAt,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
