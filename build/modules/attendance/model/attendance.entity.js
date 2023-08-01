export class AttendanceEntity {
    constructor(attendance) {
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
