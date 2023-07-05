import { objClean } from "@point-hub/express-utils";
import { GroupEntity } from "../model/group.entity.js";
import { CreateGroupRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

export class CreateGroupUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      validate(document);

      // save to database
      const groGroupEntityEntity = objClean(
        new GroupEntity({
          name: document.name,
          createdAt: new Date(),
        })
      );

      const response = await new CreateGroupRepository(this.db).handle(groGroupEntityEntity, options);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
