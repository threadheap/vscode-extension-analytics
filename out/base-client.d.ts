import { AnalyticsEvent, Exception } from "./events";
export interface IAnalyticsClient {
    initialise(): void;
    sendEvent(event: AnalyticsEvent): void;
    sendException(exception: Exception): void;
    flush(): Promise<void>;
}
