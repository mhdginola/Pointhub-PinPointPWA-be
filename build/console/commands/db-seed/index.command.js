import { BaseCommand } from "@point-hub/express-cli";
import databaseConfig from "../../../config/database.js";
import DatabaseConnection from "../../../database/connection.js";
import MongoDbConnection from "../../../database/mongodb/connection-mongodb.js";
export default class DbSeedCommand extends BaseCommand {
    constructor() {
        super({
            name: "db:seed",
            description: "Seed database",
            summary: "Seed database",
            arguments: [],
            options: [],
        });
    }
    async handle() {
        const dbConnection = new DatabaseConnection(new MongoDbConnection({
            name: databaseConfig[databaseConfig.default].name,
            url: databaseConfig[databaseConfig.default].url,
        }));
        dbConnection.database(databaseConfig[databaseConfig.default].name);
        try {
            await dbConnection.open();
            // seed examples colllection
            const { exampleSeeds } = await import("../../../modules/example/model/example.seed.js");
            await dbConnection.collection("examples").deleteAll();
            const exampleData = await dbConnection.collection("examples").createMany(exampleSeeds);
            console.info(`[seed] seeding examples data`, exampleData);
            // seed user collection
            const { userSeeds } = await import("../../../modules/user/model/user.seed.js");
            await dbConnection.collection("users").deleteAll();
            const userData = await dbConnection.collection("users").createMany(userSeeds);
            console.info(`[seed] seeding users data`, userData);
            // seed group collection
            const { groupSeeds } = await import("../../../modules/group/model/group.seed.js");
            await dbConnection.collection("groups").deleteAll();
            const groupData = await dbConnection.collection("groups").createMany(groupSeeds);
            console.info(`[seed] seeding groups data`, groupData);
            // seed tagLocation collection
            const { tagLocationSeeds } = await import("../../../modules/tagLocation/model/tagLocation.seed.js");
            await dbConnection.collection("tagLocations").deleteAll();
            const tagLocationData = await dbConnection.collection("tagLocations").createMany(tagLocationSeeds);
            console.info(`[seed] seeding tagLocations data`, tagLocationData);
            // seed invitation collection
            const { invitationSeeds } = await import("../../../modules/invitation/model/invitation.seed.js");
            await dbConnection.collection("invitations").deleteAll();
            const invitationData = await dbConnection.collection("invitations").createMany(invitationSeeds);
            console.info(`[seed] seeding invitations data`, invitationData);
            // seed attendance collection
            const { attendanceSeeds } = await import("../../../modules/attendance/model/attendance.seed.js");
            await dbConnection.collection("attendances").deleteAll();
            const attendanceData = await dbConnection.collection("attendances").createMany(attendanceSeeds);
            console.info(`[seed] seeding attendances data`, attendanceData);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            dbConnection.close();
        }
    }
}
