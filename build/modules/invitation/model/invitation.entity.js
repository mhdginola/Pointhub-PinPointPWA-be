export class InvitationEntity {
    constructor(invitation) {
        this._id = invitation._id;
        this.email = invitation.email;
        this.group = invitation.group;
        this.accept = invitation.accept;
        this.createdAt = invitation.createdAt;
        this.updatedAt = invitation.updatedAt;
    }
}
