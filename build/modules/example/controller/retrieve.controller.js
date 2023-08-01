import { RetrieveExampleUseCase } from "../use-case/retrieve.use-case.js";
import { db } from "../../../database/database.js";
export const retrieveController = async (req, res, next) => {
    try {
        const createExampleUseCase = new RetrieveExampleUseCase(db);
        const result = await createExampleUseCase.handle(req.params.id);
        res.status(200).json({
            _id: result._id,
            name: result.name,
            status: result.status,
            createdAt: result.createdAt,
        });
    }
    catch (error) {
        next(error);
    }
};
