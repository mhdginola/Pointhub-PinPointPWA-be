import { ExportAttendanceUseCase } from "../use-case/export.use-case.js";
import { db } from "../../../database/database.js";
export const exportController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const createAttendanceUseCase = new ExportAttendanceUseCase(db);
        const result = await createAttendanceUseCase.handle(req.body, { session });
        await db.commitTransaction();
        const responseValue = {
            downloadLink: result.downloadLink,
        };
        res.status(200).json(responseValue);
    }
    catch (error) {
        await db.abortTransaction();
        next(error);
    }
    finally {
        await db.endSession();
    }
};
