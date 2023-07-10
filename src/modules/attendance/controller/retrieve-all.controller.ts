import { NextFunction, Request, Response, query } from "express";
import { RetrieveAllAttendanceUseCase } from "../use-case/retrieve-all.use-case.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";

export const retrieveAllController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createAttendanceUseCase = new RetrieveAllAttendanceUseCase(db);
    const result = await createAttendanceUseCase.handle(req.query as unknown as QueryInterface);

    res.status(200).json({
      attendances: result.attendances,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
