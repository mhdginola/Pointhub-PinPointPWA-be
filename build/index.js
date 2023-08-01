import { createApp } from "./app.js";
import serverConfig from "./config/server.js";
import { Server } from "./server.js";
const server = new Server(await createApp());
await server.start(serverConfig.port);
console.info(`[server]: Server is running at ${server.url}`);
export default server;
