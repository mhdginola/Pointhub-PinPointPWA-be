import { RetrieveAllAttendanceRepository } from "../model/repository/retrieve-all.repository.js";
export class RetrieveAllAttendanceUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(query, options) {
        try {
            const response = await new RetrieveAllAttendanceRepository(this.db).handle(query, options);
            return {
                attendances: response.data,
                pagination: response.pagination,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
