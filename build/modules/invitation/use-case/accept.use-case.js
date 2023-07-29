import { objClean } from "@point-hub/express-utils";
import { InvitationEntity } from "../model/invitation.entity.js";
import { AcceptInvitationRepository } from "../model/repository/accept.repository.js";
import { validate } from "../validation/accept.validation.js";
export class AcceptInvitationUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(id, document, options) {
        try {
            // validate request body
            validate(document);
            // update database
            const invitationEntity = new InvitationEntity({
                accept: document.accept,
                updatedAt: new Date(),
            });
            const invitationRepository = new AcceptInvitationRepository(this.db);
            await invitationRepository.handle(id, objClean(invitationEntity), options);
            return;
        }
        catch (error) {
            throw error;
        }
    }
}
