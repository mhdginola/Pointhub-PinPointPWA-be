import { DeleteManyExampleUseCase } from "../use-case/delete-many.use-case.js";
import { db } from "../../../database/database.js";
export const deleteManyController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const deleteExampleUseCase = new DeleteManyExampleUseCase(db);
        await deleteExampleUseCase.handle(req.body.listId, { session });
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
