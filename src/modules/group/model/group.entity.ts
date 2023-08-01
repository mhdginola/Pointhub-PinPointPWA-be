export interface GroupEntityInterface {
  _id?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GroupEntity implements GroupEntityInterface {
  public _id?: string;
  public name?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(group: GroupEntityInterface) {
    this._id = group._id;
    this.name = group.name;
    this.createdAt = group.createdAt;
    this.updatedAt = group.updatedAt;
  }
}
