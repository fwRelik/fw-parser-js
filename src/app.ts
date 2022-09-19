import express, { Express } from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';

import { ServerController } from './server/server.controller';
import { ILogger } from './logger/logger.interface';

export class App {
    app: Express;
    server: Server;
    port: number | string;

    constructor(
        private logger: ILogger,
        private serverController: ServerController,
    ) {
        this.app = express();
        this.port = process.env.PORT ?? 3000;
    }

    useMiddleware = (): void => {
        // application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // this.app.use((req, res, next) => {
        //     res.append('Access-Control-Allow-Origin', ['*']);
        //     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        //     res.append('Access-Control-Allow-Headers', 'Content-Type');
        //     next();
        // });
    }

    useRoutes = (): void => {
        this.app.use('/', this.serverController.router);

        this.app.all('*', (req, res) => {
            res.status(404).send('Not Found.');
        });
    }

    public init = async (): Promise<void> => {
        this.useMiddleware();
        this.useRoutes();

        this.app.listen(this.port);

        this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
    }
}