import { ApiError } from "@point-hub/express-error-handler";
import DatabaseConnection, {
  CreateOptionsInterface,
  DocumentInterface,
  CreateResultInterface,
} from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

export class CreateGroupRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "groups");
  }

  public async handle(document: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface> {
    const { data: isExist } = await this.databaseManager.aggregate(
      [{ $match: { name: { $regex: `^${document.name}$`, $options: "i" } } }],
      { page: 1, pageSize: 10 }
    );

    if (isExist.length > 0) {
      throw new ApiError(422, { name: ["name must be unique"] });
    }

    return await this.databaseManager.create(document, options);
  }
}
