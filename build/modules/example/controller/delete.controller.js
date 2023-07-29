import { DeleteExampleUseCase } from "../use-case/delete.use-case.js";
import { db } from "../../../database/database.js";
export const deleteController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const deleteExampleUseCase = new DeleteExampleUseCase(db);
        await deleteExampleUseCase.handle(req.params.id, { session });
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
