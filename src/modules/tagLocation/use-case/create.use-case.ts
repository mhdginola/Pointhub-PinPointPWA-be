import { objClean } from "@point-hub/express-utils";
import { TagLocationEntity } from "../model/tagLocation.entity.js";
import { CreateTagLocationRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
import DatabaseConnection, { CreateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

export class CreateTagLocationUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      validate(document);

      // save to database
      const groTagLocationEntityEntity = objClean(
        new TagLocationEntity({
          name: document.name,
          latitude: document.latitude,
          longitude: document.longitude,
          createdAt: new Date(),
        })
      );

      const response = await new CreateTagLocationRepository(this.db).handle(groTagLocationEntityEntity, options);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }
}
