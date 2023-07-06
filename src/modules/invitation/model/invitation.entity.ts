export interface InvitationEntityInterface {
  _id?: string;
  email?: string;
  group?: string;
  accept?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InvitationEntity implements InvitationEntityInterface {
  public _id?: string;
  public email?: string;
  public group?: string;
  public accept?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(invitation: InvitationEntityInterface) {
    this._id = invitation._id;
    this.email = invitation.email;
    this.group = invitation.group;
    this.accept = invitation.accept;
    this.createdAt = invitation.createdAt;
    this.updatedAt = invitation.updatedAt;
  }
}
