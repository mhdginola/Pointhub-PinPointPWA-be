import { RetrieveAllTagLocationRepository } from "../model/repository/retrieve-all.repository.js";
export class AggregateTagLocationUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(query, options) {
        try {
            const response = await new RetrieveAllTagLocationRepository(this.db).handle(query, options);
            const transformedArray = response?.data.map((result) => ({
                _id: result._id,
                name: result.name,
                longitude: result.location?.coordinates[0],
                latitude: result.location?.coordinates[1],
                createdAt: result.createdAt,
            }));
            return {
                tagLocations: transformedArray,
                pagination: response.pagination,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
