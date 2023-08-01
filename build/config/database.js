import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";
setupEnvironment(process.env.NODE_ENV);
config();
const databaseConfig = {
    default: "mongodb",
    mongodb: {
        driver: "mongodb",
        url: `${process.env.DATABASE_URL}`,
        name: `${process.env.DATABASE_NAME}`,
    },
};
export default databaseConfig;
