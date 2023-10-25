import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateManyUserRepository } from "./repository/create-many.repository.js";
import { CreateUserRepository } from "./repository/create.repository.js";
import { db } from "../../../database/database.js";
export default class UserFactory extends Factory {
    definition() {
        return {
            username: faker.name.fullName(),
            role: "admin",
            createdAt: new Date(),
        };
    }
    async create() {
        const userRepository = new CreateUserRepository(db);
        return await userRepository.handle(this.makeOne());
    }
    async createMany(count) {
        const userRepository = new CreateManyUserRepository(db);
        return await userRepository.handle(this.makeMany(count));
    }
}
