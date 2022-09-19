import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../common/middleware.interface";
import { LoggerService } from "../logger/logger.service";
import { ILogger } from "../logger/logger.interface";

export class RequestValidatorHeader implements IMiddleware {
    logger: ILogger;
    msg: string;

    constructor() {
        this.logger = new LoggerService();
        this.msg = `Content-Type only must be 'application/x-www-form-urlencoded'`;
    }

    execute = (req: Request, res: Response, next: NextFunction): void => {
        const { headers, method, url } = req;

        this.logger.log(`[Method]: ${method} | [IP]: ${req.ip}`);

        switch (method) {
            case 'GET':
                next();
                break;
            case 'POST':
                if (headers['content-type'] !== 'application/x-www-form-urlencoded') {
                    res.status(400).send(`Content-Type only must be 'application/x-www-form-urlencoded'`);
                    return;
                }
                next();
                break;
            default:
                res.status(403).send(`Forbidden`);
                break;
        }
    }
}

export class RequestValidatorBody implements IMiddleware {

    execute = (req: Request, res: Response, next: NextFunction): void => {
        const { method } = req;
        try {
            if (method === 'POST') {
                req.body = JSON.parse(Object.keys(req.body)[0]);
                next();
            }
        } catch (e) {
            res.status(400).send(`Wrong data format`);
        }
    }
}