import { CreateExampleUseCase } from "../use-case/create.use-case.js";
import { db } from "../../../database/database.js";
export const createController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const createExampleUseCase = new CreateExampleUseCase(db);
        const result = await createExampleUseCase.handle(req.body, { session });
        await db.commitTransaction();
        const responseValue = {
            _id: result._id,
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
