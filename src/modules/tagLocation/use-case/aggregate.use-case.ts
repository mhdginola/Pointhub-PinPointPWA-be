import { RetrieveAllTagLocationRepository } from "../model/repository/retrieve-all.repository.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";

export class AggregateTagLocationUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(query: QueryInterface, options?: RetrieveAllOptionsInterface) {
    try {
      const response = await new RetrieveAllTagLocationRepository(this.db).handle(query, options);

      const transformedArray = response?.data.map(result => ({
        _id: result._id,
        name: result.name,
        longitude: result.location?.coordinates[0],
        latitude: result.location?.coordinates[1],
        createdAt: result.createdAt
      }))
      
      return {
        tagLocations: transformedArray,
        pagination: response.pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
