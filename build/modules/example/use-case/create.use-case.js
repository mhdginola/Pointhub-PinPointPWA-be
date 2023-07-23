import { objClean } from "@point-hub/express-utils";
import { ExampleEntity, ExampleStatusTypes } from "../model/example.entity.js";
import { CreateExampleRepository } from "../model/repository/create.repository.js";
import { validate } from "../validation/create.validation.js";
export class CreateExampleUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(document, options) {
        try {
            // validate request body
            validate(document);
            // save to database
            const exampleEntity = objClean(new ExampleEntity({
                name: document.name,
                firstName: document.firstName,
                lastName: document.lastName,
                optionalUniqueColumn: document.optionalUniqueColumn,
                status: ExampleStatusTypes.Active,
                createdAt: new Date(),
            }));
            const response = await new CreateExampleRepository(this.db).handle(exampleEntity, options);
            return {
                acknowledged: response.acknowledged,
                _id: response._id,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
