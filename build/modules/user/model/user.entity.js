export class UserEntity {
    constructor(user) {
        this._id = user._id;
        this.username = user.username;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
