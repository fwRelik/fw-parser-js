import { Router } from "express";
import { ILogger } from "../logger/logger.interface";
import { LoggerService } from "../logger/logger.service";
import { IControllerRoute } from "./route.interface";

export abstract class BaseController {
    private readonly _router: Router;
    logger: ILogger;

    constructor() {
        this._router = Router();
        this.logger = new LoggerService();
    }

    get router(): Router {
        return this._router;
    }

    protected bindRoutes = (routes: IControllerRoute[]): void => {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const middleware = route.middlewares?.map(m => m.execute.bind(m));
            const handler = route.func.bind(this);

            const pipeline = middleware ? [...middleware, handler] : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
}