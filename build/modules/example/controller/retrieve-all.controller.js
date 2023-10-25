import { RetrieveAllExampleUseCase } from "../use-case/retrieve-all.use-case.js";
import { db } from "../../../database/database.js";
export const retrieveAllController = async (req, res, next) => {
    try {
        const createExampleUseCase = new RetrieveAllExampleUseCase(db);
        const result = await createExampleUseCase.handle(req.query);
        res.status(200).json({
            examples: result.examples,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
