import { ApiError } from "@point-hub/express-error-handler";
import DatabaseConnection, {
  DocumentInterface,
  UpdateOptionsInterface,
  UpdateResultInterface,
} from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";
import { ObjectId } from "mongodb";

export class UpdateGroupRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "groups");
  }

  public async handle(
    id: string,
    document: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface> {
    const { data: isExist } = await this.databaseManager.aggregate([
      { $match: {
          _id: { $ne: new ObjectId(id) },
          name: { $regex: `^${document.name}$`, $options: 'i' }
        }
      }
    ], { page: 1, pageSize: 10 });

    if(isExist.length > 0) {
      throw new ApiError(422, { name: ["name must be unique"] })
    }

    return await this.databaseManager.update(id, document, options);
  }
}
