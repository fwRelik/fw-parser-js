export interface ISearchHTML {
    load: (data: string, selector: string | string[]) => string | null | (string | null)[];
}