import { AggregateTagLocationUseCase } from "../use-case/aggregate.use-case.js";
import { db } from "../../../database/database.js";
export const retrieveAllController = async (req, res, next) => {
    try {
        const createTagLocationUseCase = new AggregateTagLocationUseCase(db);
        const result = await createTagLocationUseCase.handle(req.query);
        res.status(200).json({
            tagLocations: result.tagLocations,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
