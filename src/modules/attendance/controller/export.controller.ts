import { NextFunction, Request, Response } from "express";
import { ExportAttendanceUseCase } from "../use-case/export.use-case.js";
import { db } from "@src/database/database.js";

interface ResponseInterface {
  downloadLink: string;
}

export const exportController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const createAttendanceUseCase = new ExportAttendanceUseCase(db);
    const result = await createAttendanceUseCase.handle(req.body, { session });

    await db.commitTransaction();

    const responseValue: ResponseInterface = {
      downloadLink: result.downloadLink
    };

    res.status(200).json(responseValue);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
