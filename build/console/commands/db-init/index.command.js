import { BaseCommand } from "@point-hub/express-cli";
import databaseConfig from "../../../config/database.js";
import DatabaseConnection from "../../../database/connection.js";
import MongoDbConnection from "../../../database/mongodb/connection-mongodb.js";
export default class DbInitCommand extends BaseCommand {
    constructor() {
        super({
            name: "db:init",
            description: "Create database collections and schema validation",
            summary: "Create database collections and schema validation",
            arguments: [],
            options: [
                {
                    type: "string",
                    flag: "--db-name",
                    description: "Database Name",
                    default: "",
                },
            ],
        });
    }
    async handle() {
        const dbName = this.opts["--db-name"] ?? databaseConfig[databaseConfig.default].name;
        const dbConnection = new DatabaseConnection(new MongoDbConnection({
            name: dbName,
            url: databaseConfig[databaseConfig.default].url,
        }));
        try {
            await dbConnection.open();
            dbConnection.database(dbName);
            // add collections and schema validation
            await dbConnection.createCollections();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            dbConnection.close();
        }
    }
}
