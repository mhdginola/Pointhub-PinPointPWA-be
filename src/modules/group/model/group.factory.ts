import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { GroupEntityInterface } from "./group.entity.js";
import { CreateManyGroupRepository } from "./repository/create-many.repository.js";
import { CreateGroupRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";

export default class GroupFactory extends Factory<GroupEntityInterface> {
  definition() {
    return {
      name: faker.name.fullName(),
      createdAt: new Date(),
    };
  }

  async create() {
    const groupRepository = new CreateGroupRepository(db);
    return await groupRepository.handle(this.makeOne());
  }

  async createMany(count: number) {
    const groupRepository = new CreateManyGroupRepository(db);
    return await groupRepository.handle(this.makeMany(count));
  }
}
