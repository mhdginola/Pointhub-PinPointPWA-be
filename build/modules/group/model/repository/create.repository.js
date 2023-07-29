import { ApiError } from "@point-hub/express-error-handler";
import DatabaseManager from "../../../../database/database-manager.js";
export class CreateGroupRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "groups");
    }
    async handle(document, options) {
        const { data: isExist } = await this.databaseManager.aggregate([{ $match: { name: { $regex: `^${document.name}$`, $options: "i" } } }], { page: 1, pageSize: 10 });
        if (isExist.length > 0) {
            throw new ApiError(422, { name: ["name must be unique"] });
        }
        return await this.databaseManager.create(document, options);
    }
}
