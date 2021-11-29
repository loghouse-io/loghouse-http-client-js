export interface ILoghouseClientOptions {
    accessToken: string;
    bucketId: string;
}
interface ILogEntry {
    message: string;
    timestamp?: number;
    metadata?: object;
}
export declare class LoghouseClient {
    private readonly accessToken;
    private readonly bucketId;
    private httpClient;
    constructor(options: ILoghouseClientOptions);
    log(logEntry: ILogEntry | ILogEntry[]): Promise<void>;
    build(logEntry: ILogEntry | ILogEntry[]): ILogEntry[];
}
export {};
