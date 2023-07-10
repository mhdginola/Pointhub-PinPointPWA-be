import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { InvitationEntityInterface } from "./invitation.entity.js";
import { CreateManyInvitationRepository } from "./repository/create-many.repository.js";
import { CreateInvitationRepository } from "./repository/create.repository.js";
import { db } from "@src/database/database.js";

export default class InvitationFactory extends Factory<InvitationEntityInterface> {
  definition() {
    return {
      email: faker.internet.email(),
      group: faker.name.jobTitle(),
      accept: false,
      createdAt: new Date(),
    };
  }

  async create() {
    const invitationRepository = new CreateInvitationRepository(db);
    return await invitationRepository.handle(this.makeOne());
  }

  async createMany(count: number) {
    const invitationRepository = new CreateManyInvitationRepository(db);
    return await invitationRepository.handle(this.makeMany(count));
  }
}
