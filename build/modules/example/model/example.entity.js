export var ExampleStatusTypes;
(function (ExampleStatusTypes) {
    ExampleStatusTypes["Active"] = "active";
    ExampleStatusTypes["Suspended"] = "suspended";
})(ExampleStatusTypes || (ExampleStatusTypes = {}));
export class ExampleEntity {
    constructor(example) {
        this._id = example._id;
        this.name = example.name;
        this.firstName = example.firstName;
        this.lastName = example.lastName;
        this.optionalUniqueColumn = example.optionalUniqueColumn;
        this.status = example.status;
        this.createdAt = example.createdAt;
        this.updatedAt = example.updatedAt;
    }
}
