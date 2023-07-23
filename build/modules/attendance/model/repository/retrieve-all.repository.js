import DatabaseManager from "../../../../database/database-manager.js";
export class RetrieveAllAttendanceRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "attendances");
    }
    async handle(query, options) {
        const aggregates = [];
        if (query.filter) {
            const { date_from, date_to, ...newFilter } = query.filter ?? { date_from: undefined, date_to: undefined };
            if (date_from && date_to) {
                aggregates.push({
                    $match: {
                        createdAt: { $gte: new Date(new Date(date_from.toString()).toISOString()), $lte: new Date(new Date(date_to.toString()).toISOString()) }
                    }
                });
            }
            for (const key of Object.keys(newFilter)) {
                aggregates.push({ $match: { [key]: query.filter[key] } });
            }
        }
        return await this.databaseManager.aggregate(aggregates, { page: query.page || 1, pageSize: query.pageSize || 10 });
    }
}
