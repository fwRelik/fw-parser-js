export interface IPPTR {
    launch: () => Promise<any>;
    close: () => Promise<void>;
    getPage: (url: string | void) => Promise<string | null>;
}