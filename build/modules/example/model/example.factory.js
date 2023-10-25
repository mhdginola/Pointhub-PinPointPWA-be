import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { ExampleStatusTypes } from "./example.entity.js";
import { CreateManyExampleRepository } from "./repository/create-many.repository.js";
import { CreateExampleRepository } from "./repository/create.repository.js";
import { db } from "../../../database/database.js";
export default class ExampleFactory extends Factory {
    definition() {
        return {
            name: faker.name.fullName(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            status: ExampleStatusTypes.Active,
            createdAt: new Date(),
        };
    }
    async create() {
        const exampleRepository = new CreateExampleRepository(db);
        return await exampleRepository.handle(this.makeOne());
    }
    async createMany(count) {
        const exampleRepository = new CreateManyExampleRepository(db);
        return await exampleRepository.handle(this.makeMany(count));
    }
}
