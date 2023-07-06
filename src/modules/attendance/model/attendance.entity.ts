export interface AttendanceEntityInterface {
  _id?: string;
  group?: string;
  photo?: string;
  location?: Array<number | string>;
  email?: string;
  groupName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AttendanceEntity implements AttendanceEntityInterface {
  public _id?: string;
  public group?: string;
  public photo?: string;
  public location?: Array<number | string>;
  public email?: string;
  public groupName?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(attendance: AttendanceEntityInterface) {
    this._id = attendance._id;
    this.group = attendance.group;
    this.photo = attendance.photo;
    this.location = attendance.location;
    this.email = attendance.email;
    this.groupName = attendance.groupName;
    this.createdAt = attendance.createdAt;
    this.updatedAt = attendance.updatedAt;
  }
}
