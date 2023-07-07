import { AttendanceEntityInterface } from "../attendance.entity.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";
import { ObjectId } from "mongodb";

interface DataInterface extends AttendanceEntityInterface {
  _id: string;
}

interface ResponseInterface {
  data: Array<DataInterface>;
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    totalDocument: number;
  };
}

export class RetrieveAllAttendanceRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "attendances");
  }

  public async handle(query: QueryInterface, options?: RetrieveAllOptionsInterface): Promise<ResponseInterface> {
    const aggregates: any = [];

    if (query.filter) {
      const { date_from, date_to, ...newFilter } = query.filter ?? { date_from: undefined, date_to: undefined };

      if(date_from && date_to) {
        aggregates.push({ 
          $match: { 
            createdAt: { $gte: new Date(new Date(date_from.toString()).toISOString()), $lte: new Date(new Date(date_to.toString()).toISOString()) } 
          } 
        })
      }

      for (const key of Object.keys(newFilter)) {
        aggregates.push({ $match: { [key]: query.filter[key] } })
      }
    }

    return await this.databaseManager.aggregate(aggregates, { page: query.page || 1, pageSize: query.pageSize || 10 });
  }
}
