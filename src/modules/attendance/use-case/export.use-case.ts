// import Excel from 'exceljs';
import path from 'path';
import { ExportAttendanceRepository } from "../model/repository/export.repository.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";

export class ExportAttendanceUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(query: QueryInterface, options?: RetrieveAllOptionsInterface) {
    try {
      const response = await new ExportAttendanceRepository(this.db).handle(query, options);

      // const workbook = new Excel.Workbook();
      // const worksheet = workbook.addWorksheet("Attendance");

      // worksheet.columns = [
      //   { header: 'Group', key: 'group', width: 18 },
      //   { header: 'Photo', key: 'photo', width: 13 },
      //   { header: 'Location', key: 'location', width: 13 },
      //   { header: 'Email', key: 'email', width: 13 },
      //   { header: 'Group Name', key: 'groupName', width: 17 }
      // ];

      // worksheet.columns.forEach((sheetColumn) => {
      //   sheetColumn.font = {
      //     size: 12,
      //   };
      //   sheetColumn.width = 30;
      // });
      
      // worksheet.getRow(1).font = {
      //   bold: true,
      //   size: 13,
      // };

      // response.data.forEach((attendance) => {
      //   worksheet.addRow(attendance)
      // });

      const fileName = "attendances-report-" + Math.random().toString(36).substr(2) + ".xlsx";
      // const exportPath = path.resolve(new URL(import.meta.url).pathname, `../../../../../src/assets/${fileName}`);

      // await workbook.xlsx.writeFile(exportPath);

      return {
        downloadLink: `http://localhost:3000/assets/${fileName}`,
      }
    } catch (error) {
      throw error;
    }
  }
}
