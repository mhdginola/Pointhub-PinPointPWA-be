export class GroupEntity {
    constructor(group) {
        this._id = group._id;
        this.name = group.name;
        this.createdAt = group.createdAt;
        this.updatedAt = group.updatedAt;
    }
}
