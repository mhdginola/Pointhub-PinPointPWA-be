import { objClean } from "@point-hub/express-utils";
import { CreateTagLocationRepository } from "../model/repository/create.repository.js";
import { TagLocationEntity } from "../model/tagLocation.entity.js";
import { validate } from "../validation/create.validation.js";
export class CreateTagLocationUseCase {
    constructor(db) {
        this.db = db;
    }
    async handle(document, options) {
        try {
            // validate request body
            validate(document);
            // save to database
            const tagLocationEntity = objClean(new TagLocationEntity({
                name: document.name,
                location: {
                    type: "Point",
                    coordinates: [document.longitude, document.latitude],
                },
                createdAt: new Date(),
            }));
            const response = await new CreateTagLocationRepository(this.db).handle(tagLocationEntity, options);
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
