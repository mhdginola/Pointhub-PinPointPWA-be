import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";
setupEnvironment(process.env.NODE_ENV);
config();
const serverConfig = {
    port: Number(process.env.PORT ?? 3000),
};
export default serverConfig;
