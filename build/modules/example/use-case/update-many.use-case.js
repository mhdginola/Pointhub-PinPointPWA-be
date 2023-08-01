import { objClean } from "@point-hub/express-utils";
import { ExampleEntity, ExampleStatusTypes } from "../model/example.entity.js";
import { UpdateManyExampleRepository } from "../model/repository/update-many.repository.js";
import { validate } from "../validation/update-many.validation.js";
export class UpdateManyExampleUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(document, options) {
        try {
            // validate request body
            validate(document);
            const exampleEntity = new ExampleEntity({
                status: ExampleStatusTypes.Suspended,
                updatedAt: new Date(),
            });
            const updateResponse = await new UpdateManyExampleRepository(this.db).handle({
                name: {
                    $regex: `${document.filter.name}`,
                    $options: "i",
                },
            }, {
                $set: objClean(exampleEntity),
            }, options);
            return {
                acknowledged: updateResponse.acknowledged,
                matchedCount: updateResponse.matchedCount,
                modifiedCount: updateResponse.modifiedCount,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
