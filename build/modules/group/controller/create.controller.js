import { CreateGroupUseCase } from "../use-case/create.use-case.js";
import { db } from "../../../database/database.js";
export const createController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const createGroupUseCase = new CreateGroupUseCase(db);
        const result = await createGroupUseCase.handle(req.body, { session });
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
