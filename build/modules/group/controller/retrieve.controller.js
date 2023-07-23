import { RetrieveGroupUseCase } from "../use-case/retrieve.use-case.js";
import { db } from "../../../database/database.js";
export const retrieveController = async (req, res, next) => {
    try {
        const createGroupUseCase = new RetrieveGroupUseCase(db);
        const result = await createGroupUseCase.handle(req.params.id);
        res.status(200).json({
            _id: result._id,
            name: result.name,
            createdAt: result.createdAt,
        });
    }
    catch (error) {
        next(error);
    }
};
