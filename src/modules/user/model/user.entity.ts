export interface UserEntityInterface {
  _id?: string;
  username?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity implements UserEntityInterface {
  public _id?: string;
  public username?: string;
  public role?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(user: UserEntityInterface) {
    this._id = user._id;
    this.username = user.username;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
