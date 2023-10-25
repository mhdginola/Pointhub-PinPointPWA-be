import { invalidPathMiddleware, errorHandlerMiddleware } from "@point-hub/express-error-handler";
import compression from "compression";
import cors from "cors";
import { json, urlencoded, Express } from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";

/**
 * The application's global middleware stack.
 * These middleware are run during every request to your application.
 */
export default class Middleware {
  app: Express;
  constructor(app: Express) {
    this.app = app;
  }

  registerBeforeRoutes() {
    /**
     * Get Client IP
     *
     * 1. Edit nginx header like this "proxy_set_header X-Forwarded-For $remote_addr;"
     * 2. Enable trust proxy on express app "app.set('trust proxy', true)"
     * 3. Use "req.ip" to get Client IP
     *
     * Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
     * see https://expressjs.com/en/guide/behind-proxies.html
     */
    this.app.set("trust proxy", true);
    // Gzip compressing can greatly decrease the size of the response body
    this.app.use(compression());
    // Parse json request body
    this.app.use(json());
    // Parse urlencoded request body
    this.app.use(urlencoded({ extended: false }));
    // Set security HTTP headers
    this.app.use(helmet());
    // Cors
    this.app.use(
      cors({
        origin: ["http://localhost:8080", "http://localhost:5173", "https://pointhub-pin-point-pwa-fe.vercel.app"],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
      })
    );
    this.app.set("trust proxy", 1);
    this.app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true },
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  registerAfterRoutes() {
    this.app.use(invalidPathMiddleware);
    this.app.use(errorHandlerMiddleware);
  }
}
