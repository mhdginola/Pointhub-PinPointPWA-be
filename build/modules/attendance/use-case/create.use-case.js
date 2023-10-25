import { objClean } from "@point-hub/express-utils";
import { AttendanceEntity } from "../model/attendance.entity.js";
import { CreateAttendanceRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
export class CreateAttendanceUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(document, options) {
        try {
            // validate request body
            validate(document);
            // save to database
            const attendanceEntity = objClean(new AttendanceEntity({
                group: document.group,
                photo: document.photo,
                location: document.location,
                email: document.email,
                groupName: document.groupName,
                createdAt: new Date(),
            }));
            const response = await new CreateAttendanceRepository(this.db).handle(attendanceEntity, options);
            return {
                acknowledged: response.acknowledged,
                _id: response._id,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
