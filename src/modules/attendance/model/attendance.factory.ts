import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { AttendanceEntityInterface } from "./attendance.entity.js";
import { CreateManyAttendanceRepository } from "./repository/create-many.repository.js";
import { CreateAttendanceRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";

export default class AttendanceFactory extends Factory<AttendanceEntityInterface> {
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

  async createMany(count: number) {
    const attendanceRepository = new CreateManyAttendanceRepository(db);
    return await attendanceRepository.handle(this.makeMany(count));
  }
}
