import { AttendanceEntityInterface } from "../attendance.entity.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

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

export class ExportAttendanceRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "attendances");
  }

  public async handle(query: QueryInterface, options?: RetrieveAllOptionsInterface): Promise<ResponseInterface> {
    return await this.databaseManager.retrieveAll(query, options);
  }
}
