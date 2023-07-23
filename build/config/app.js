import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";
setupEnvironment(process.env.NODE_ENV);
config();
const appConfig = {
    url: `${process.env.APP_URL}`,
    name: `${process.env.APP_NAME}`,
};
export default appConfig;
