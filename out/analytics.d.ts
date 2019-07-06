import { IAnalyticsClient } from "./base-client";
import { AnalyticsEvent, Exception } from "./events";
export declare class AnalyticsReporter {
    private extensionId;
    private extensionVersion;
    private analyticsClient;
    private userOptIn;
    private readonly configListener;
    private static TELEMETRY_CONFIG_ID;
    private static TELEMETRY_CONFIG_ENABLED_ID;
    private logStream;
    private commonAttributes;
    constructor(extensionId: string, extensionVersion: string, client: IAnalyticsClient);
    private updateUserOptIn;
    private initialiseAnalyticsClient;
    private getCommonAttributes;
    sendEvent(event: AnalyticsEvent): void;
    sendException(exception: Exception): void;
    dispose(): Promise<void>;
}
