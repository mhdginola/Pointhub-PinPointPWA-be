import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";

setupEnvironment(process.env.NODE_ENV as string);
config();

export interface IAppConfig {
  url: string;
  name: string;
}

const appConfig: IAppConfig = {
  url: `${process.env.APP_URL}`,
  name: `${process.env.APP_NAME}`,
};

export default appConfig;
