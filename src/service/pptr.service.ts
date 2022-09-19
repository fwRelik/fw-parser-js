import puppeteer, { Page, Browser } from "puppeteer";
import { ILogger } from "../logger/logger.interface";
import { IPPTR } from "./pptr.service.interface";

export class PPTR implements IPPTR {
    page: Page;
    browser: Browser;

    constructor(private logger: ILogger) { }

    launch = async (): Promise<any> => {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        this.logger.log('PPTR Service Started');
    }

    close = async (): Promise<void> => {
        this.browser.close();
        this.logger.warn('PPTR Service Closed!');

        setTimeout(() => { this.launch(); }, 2000);
    }

    getPage = async (url: string | void): Promise<string | null> => {
        if (this.page && typeof url === 'string') {
            await this.page.goto(url);
            return await this.page.content();
        } else {
            this.logger.error('PPTR Service Not Started!');
            return null;
        }
    }
}