import { UpdateManyExampleUseCase } from "../use-case/update-many.use-case.js";
import { db } from "../../../database/database.js";
export const updateManyController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const updateManyExampleUseCase = new UpdateManyExampleUseCase(db);
        await updateManyExampleUseCase.handle(req.body, { session });
        await db.commitTransaction();
        res.status(204).json();
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
