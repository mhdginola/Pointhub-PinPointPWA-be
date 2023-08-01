import { objClean } from "@point-hub/express-utils";
import { InvitationEntity } from "../model/invitation.entity.js";
import { CreateInvitationRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
export class CreateInvitationUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(document, options) {
        try {
            // validate request body
            validate(document);
            // save to database
            const invitationEntity = objClean(new InvitationEntity({
                email: document.email,
                group: document.group,
                createdAt: new Date(),
            }));
            const response = await new CreateInvitationRepository(this.db).handle(invitationEntity, options);
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
