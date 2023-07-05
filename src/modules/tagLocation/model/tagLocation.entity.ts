export interface TagLocationEntityInterface {
  _id?: string;
  name?: string;
  latitude?: number | string;
  longitude?: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TagLocationEntity implements TagLocationEntityInterface {
  public _id?: string;
  public name?: string;
  public latitude?: number | string;
  public longitude?: number | string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(tagLocation: TagLocationEntityInterface) {
    this._id = tagLocation._id;
    this.name = tagLocation.name;
    this.latitude = tagLocation.latitude;
    this.longitude = tagLocation.longitude;
    this.createdAt = tagLocation.createdAt;
    this.updatedAt = tagLocation.updatedAt;
  }
}
