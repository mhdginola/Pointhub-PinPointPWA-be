import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateManyTagLocationRepository } from "./repository/create-many.repository.js";
import { CreateTagLocationRepository } from "./repository/create.repository.js";
import { TagLocationEntityInterface } from "./tagLocation.entity.js";
import { db } from "@src/database/database.js";

export default class TagLocationFactory extends Factory<TagLocationEntityInterface> {
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

  async createMany(count: number) {
    const tagLocationRepository = new CreateManyTagLocationRepository(db);
    return await tagLocationRepository.handle(this.makeMany(count));
  }
}
