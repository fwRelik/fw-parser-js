import { LoggerService } from './logger/logger.service';
import { ServerController } from './server/server.controller';

import { App } from './app';
import { PPTR } from './service/pptr.service';
import { SearchHTML } from './service/search.service';

async function bootstrap() {
    const logger = new LoggerService();
    const searchHTML = new SearchHTML();

    const pptr = new PPTR(logger);
    pptr.launch();

    const serverController = new ServerController(pptr, searchHTML);

    const app = new App(
        logger,
        serverController,

    );
    app.init();
}

bootstrap();