import { objClean } from "@point-hub/express-utils";
import { GroupEntity } from "../model/group.entity.js";
import { CreateGroupRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
export class CreateGroupUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(document, options) {
        try {
            // validate request body
            validate(document);
            // save to database
            const groupEntity = objClean(new GroupEntity({
                name: document.name,
                createdAt: new Date(),
            }));
            const response = await new CreateGroupRepository(this.db).handle(groupEntity, options);
            return {
                acknowledged: response.acknowledged,
                _id: response._id,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
