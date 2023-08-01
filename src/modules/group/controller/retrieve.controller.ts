import { NextFunction, Request, Response } from "express";
import { RetrieveGroupUseCase } from "../use-case/retrieve.use-case.js";
import { db } from "@src/database/database.js";

export const retrieveController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createGroupUseCase = new RetrieveGroupUseCase(db);
    const result = await createGroupUseCase.handle(req.params.id);

    res.status(200).json({
      _id: result._id,
      name: result.name,
      createdAt: result.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
