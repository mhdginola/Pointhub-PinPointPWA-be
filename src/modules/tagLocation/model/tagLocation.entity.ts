export interface PointLocation {
  type: string;
  coordinates: number[];
}

export interface TagLocationEntityInterface {
  _id?: string;
  name?: string;
  location?: PointLocation;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TagLocationEntity implements TagLocationEntityInterface {
  public _id?: string;
  public name?: string;
  public location?: PointLocation;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(tagLocation: TagLocationEntityInterface) {
    this._id = tagLocation._id;
    this.name = tagLocation.name;
    this.location = tagLocation.location;
    this.createdAt = tagLocation.createdAt;
    this.updatedAt = tagLocation.updatedAt;
  }
}
