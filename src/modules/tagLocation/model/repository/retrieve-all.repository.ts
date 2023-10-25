import { TagLocationEntityInterface } from "../tagLocation.entity.js";
import DatabaseConnection, { QueryInterface, RetrieveAllOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface DataInterface extends TagLocationEntityInterface {
  _id: string;
}

interface ResponseInterface {
  data: Array<DataInterface>;
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    totalDocument: number;
  };
}

interface CoordinateQueryInterface {
  longitude: number;
  latitude: number;
  distance: number;
}

export class RetrieveAllTagLocationRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "tagLocations");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(query: QueryInterface, _options?: RetrieveAllOptionsInterface): Promise<ResponseInterface> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aggregates: any = [];

    const { longitude, latitude, distance } = query as unknown as CoordinateQueryInterface;

    if (longitude && latitude) {
      aggregates.push({
        $geoNear: {
          near: { type: "Point", coordinates: [+longitude, +latitude] },
          maxDistance: +distance | 100,
          distanceField: "dist.calculated",
          spherical: true,
        },
      });
    }

    if (query.filter) {
      for (const key of Object.keys(query.filter)) {
        aggregates.push({ $match: { [key]: query.filter[key] } });
      }
    }

    return await this.databaseManager.aggregate(aggregates, { page: query.page || 1, pageSize: query.pageSize || 10 });
  }
}
