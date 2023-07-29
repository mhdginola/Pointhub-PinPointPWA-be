import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateManyAttendanceRepository } from "./repository/create-many.repository.js";
import { CreateAttendanceRepository } from "./repository/create.repository.js";
import { db } from "../../../database/database.js";
export default class AttendanceFactory extends Factory {
    definition() {
        return {
            group: faker.name.lastName(),
            photo: faker.internet.avatar(),
            location: faker.address.nearbyGPSCoordinate(),
            email: faker.internet.email(),
            groupName: faker.name.firstName(),
            createdAt: new Date(),
        };
    }
    async create() {
        const attendanceRepository = new CreateAttendanceRepository(db);
        return await attendanceRepository.handle(this.makeOne());
    }
    async createMany(count) {
        const attendanceRepository = new CreateManyAttendanceRepository(db);
        return await attendanceRepository.handle(this.makeMany(count));
    }
}
