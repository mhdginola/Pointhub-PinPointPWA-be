import { RetrieveAllAttendanceUseCase } from "../use-case/retrieve-all.use-case.js";
import { db } from "../../../database/database.js";
export const retrieveAllController = async (req, res, next) => {
    try {
        const createAttendanceUseCase = new RetrieveAllAttendanceUseCase(db);
        const result = await createAttendanceUseCase.handle(req.query);
        res.status(200).json({
            attendances: result.attendances,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
