import { ApiError } from "@point-hub/express-error-handler";
import { ObjectId } from "mongodb";
import DatabaseManager from "../../../../database/database-manager.js";
export class UpdateGroupRepository {
    constructor(databaseConnection) {
        this.databaseManager = new DatabaseManager(databaseConnection, "groups");
    }
    async handle(id, document, options) {
        const { data: isExist } = await this.databaseManager.aggregate([
            {
                $match: {
                    _id: { $ne: new ObjectId(id) },
                    name: { $regex: `^${document.name}$`, $options: "i" },
                },
            },
        ], { page: 1, pageSize: 10 });
        if (isExist.length > 0) {
            throw new ApiError(422, { name: ["name must be unique"] });
        }
        return await this.databaseManager.update(id, document, options);
    }
}
