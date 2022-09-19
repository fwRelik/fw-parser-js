import cheerio, { CheerioAPI, Cheerio } from "cheerio";
import { ISearchHTML } from "./search.service.interface";

export class SearchHTML implements ISearchHTML {
    cheerio: CheerioAPI;

    constructor() {
        this.cheerio = cheerio;
    }

    load = (data: string, selector: string | string[]): string | null | (string | null)[] => {
        let result: string | null | (string | null)[] = '';

        const $ = this.cheerio.load(data);
        if (Array.isArray(selector)) {
            result = selector.map(item => {
                return $(item).html();
            });
        } else {
            result = $(selector).html();
        }

        return result;
    }
}