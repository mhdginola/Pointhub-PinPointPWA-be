import { CreateManyExampleUseCase } from "../use-case/create-many.use-case.js";
import { db } from "../../../database/database.js";
export const createManyController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const createManyExampleUseCase = new CreateManyExampleUseCase(db);
        const result = await createManyExampleUseCase.handle(req.body, { session });
        await db.commitTransaction();
        const responseValue = {
            insertedCount: result.insertedCount,
            insertedIds: result.insertedIds,
        };
        res.status(201).json(responseValue);
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
