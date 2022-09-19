import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { IPPTR } from "../service/pptr.service.interface";
import { ISearchHTML } from "../service/search.service.interface";
import { IServerController } from "./server.controller.interface";
import { LoggerService } from "../logger/logger.service";
import { ILogger } from "../logger/logger.interface";
import { RequestValidatorHeader, RequestValidatorBody } from "../middleware/validator.middleware";
import { IMiddleware } from "../common/middleware.interface";

export class ServerController extends BaseController implements IServerController {
    logger: ILogger;
    requestValidatorHeader: IMiddleware;
    requestValidatorBody: IMiddleware;

    constructor(
        private getPage: IPPTR,
        private searchHTML: ISearchHTML
    ) {
        super();
        this.logger = new LoggerService();
        this.requestValidatorHeader = new RequestValidatorHeader();
        this.requestValidatorBody = new RequestValidatorBody();

        this.bindRoutes([
            {
                path: '/*',
                method: 'post',
                func: this.parse,
                middlewares: [
                    this.requestValidatorHeader,
                    this.requestValidatorBody
                ]
            },
            {
                path: '/restart',
                method: 'get',
                func: this.close
            }
        ]);
    }

    parse = (req: Request, res: Response, next: NextFunction): void => {
        const { host, selectors } = req.body;

        this.getPage.getPage(host)
            .then(result => {
                if (typeof result === 'string') {
                    const content = this.searchHTML.load(result, selectors);
                    res.status(200).send(content);
                } else if (result === null) {
                    res.status(425).send('Failed Dependency');
                } else {
                    res.status(204).send('No Content');
                }
            })
            .catch(err => this.logger.error(err));
    }

    close = (req: Request, res: Response, next: NextFunction): void => {
        this.logger.warn('PPTR service will restart in 2 seconds');
        this.getPage.close();
        res.status(202).send('Accepted');
        return;
    }
}