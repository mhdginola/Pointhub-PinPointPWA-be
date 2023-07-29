import DatabaseManager from "../../../../database/database-manager.js";
export class RetrieveAllTagLocationRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "tagLocations");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(query, _options) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aggregates = [];
        const { longitude, latitude, distance } = query;
        if (longitude && latitude) {
            aggregates.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [+longitude, +latitude] },
                    maxDistance: +distance | 100,
                    distanceField: "dist.calculated",
                    spherical: true,
                },
            });
        }
        if (query.filter) {
            for (const key of Object.keys(query.filter)) {
                aggregates.push({ $match: { [key]: query.filter[key] } });
            }
        }
        return await this.databaseManager.aggregate(aggregates, { page: query.page || 1, pageSize: query.pageSize || 10 });
    }
}
