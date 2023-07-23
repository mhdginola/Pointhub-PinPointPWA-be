export class TagLocationEntity {
    constructor(tagLocation) {
        this._id = tagLocation._id;
        this.name = tagLocation.name;
        this.location = tagLocation.location;
        this.createdAt = tagLocation.createdAt;
        this.updatedAt = tagLocation.updatedAt;
    }
}
