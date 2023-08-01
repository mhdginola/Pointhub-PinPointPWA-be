import { NextFunction, Request, Response } from "express";
import { AggregateTagLocationUseCase } from "../use-case/aggregate.use-case.js";
import { QueryInterface } from "@src/database/connection.js";
import { db } from "@src/database/database.js";

export const retrieveAllController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createTagLocationUseCase = new AggregateTagLocationUseCase(db);
    const result = await createTagLocationUseCase.handle(req.query as unknown as QueryInterface);

    res.status(200).json({
      tagLocations: result.tagLocations,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
