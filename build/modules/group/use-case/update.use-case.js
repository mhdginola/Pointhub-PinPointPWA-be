import { objClean } from "@point-hub/express-utils";
import { GroupEntity } from "../model/group.entity.js";
import { UpdateGroupRepository } from "../model/repository/update.repository.js";
import { validate } from "../validation/update.validation.js";
export class UpdateGroupUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(id, document, options) {
        try {
            // validate request body
            validate(document);
            // update database
            const groupEntity = new GroupEntity({
                name: document.name,
                updatedAt: new Date(),
            });
            const groupRepository = new UpdateGroupRepository(this.db);
            await groupRepository.handle(id, objClean(groupEntity), options);
            return;
        }
        catch (error) {
            throw error;
        }
    }
}
