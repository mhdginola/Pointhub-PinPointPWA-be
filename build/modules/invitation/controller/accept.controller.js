import { AcceptInvitationUseCase } from "../use-case/accept.use-case.js";
import { db } from "../../../database/database.js";
export const acceptController = async (req, res, next) => {
    try {
        const session = db.startSession();
        db.startTransaction();
        const acceptAcceptInvitationUseCase = new AcceptInvitationUseCase(db);
        await acceptAcceptInvitationUseCase.handle(req.params.id, req.body, { session });
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
