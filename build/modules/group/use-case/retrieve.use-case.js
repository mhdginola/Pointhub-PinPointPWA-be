import { RetrieveGroupRepository } from "../model/repository/retrieve.repository.js";
export class RetrieveGroupUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(id, options) {
        try {
            const response = await new RetrieveGroupRepository(this.db).handle(id, options);
            return {
                _id: response._id,
                name: response.name,
                createdAt: response.createdAt,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
