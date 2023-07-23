import { RetrieveAllGroupUseCase } from "../use-case/retrieve-all.use-case.js";
import { db } from "../../../database/database.js";
export const retrieveAllController = async (req, res, next) => {
    try {
        const createGroupUseCase = new RetrieveAllGroupUseCase(db);
        const result = await createGroupUseCase.handle(req.query);
        res.status(200).json({
            groups: result.groups,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
