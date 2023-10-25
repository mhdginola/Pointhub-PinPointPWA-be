import { objClean } from "@point-hub/express-utils";
import { ExampleEntity, ExampleStatusTypes } from "../model/example.entity.js";
import { CreateManyExampleRepository } from "../model/repository/create-many.repository.js";
import { validate } from "../validation/create-many.validation.js";
export class CreateManyExampleUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(documents, options) {
        try {
            // validate request body
            validate(documents);
            // define entity
            const entities = [];
            for (const document of documents) {
                entities.push(objClean(new ExampleEntity({
                    name: document.name,
                    firstName: document.firstName,
                    lastName: document.lastName,
                    status: ExampleStatusTypes.Active,
                    createdAt: new Date(),
                })));
            }
            // save to database
            const response = await new CreateManyExampleRepository(this.db).handle(entities, options);
            return {
                acknowledged: response.acknowledged,
                insertedCount: response.insertedCount,
                insertedIds: response.insertedIds,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
