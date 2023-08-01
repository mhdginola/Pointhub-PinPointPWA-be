import { NextFunction, Request, Response } from "express";
import { RetrieveAllGroupUseCase } from "../use-case/retrieve-all.use-case.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";

export const retrieveAllController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createGroupUseCase = new RetrieveAllGroupUseCase(db);
    const result = await createGroupUseCase.handle(req.query as unknown as QueryInterface);

    res.status(200).json({
      groups: result.groups,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
