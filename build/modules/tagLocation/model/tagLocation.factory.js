import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateManyTagLocationRepository } from "./repository/create-many.repository.js";
import { CreateTagLocationRepository } from "./repository/create.repository.js";
import { db } from "../../../database/database.js";
export default class TagLocationFactory extends Factory {
    definition() {
        return {
            name: faker.name.fullName(),
            location: {
                type: "Point",
                coordinates: [parseFloat(faker.address.longitude()), parseFloat(faker.address.latitude())],
            },
            createdAt: new Date(),
        };
    }
    async create() {
        const tagLocationRepository = new CreateTagLocationRepository(db);
        return await tagLocationRepository.handle(this.makeOne());
    }
    async createMany(count) {
        const tagLocationRepository = new CreateManyTagLocationRepository(db);
        return await tagLocationRepository.handle(this.makeMany(count));
    }
}
