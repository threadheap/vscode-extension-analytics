import { IAnalyticsClient } from "./base-client";
import { AnalyticsEvent, Exception } from "./events";
interface AnalyticsReporterOptions {
    configId?: string;
    configEnabledId?: string;
}
export declare class AnalyticsReporter {
    private extensionId;
    private extensionVersion;
    private analyticsClient;
    private userOptIn;
    private readonly configListener;
    private telemetryConfigId;
    private telemetryConfigEnabledId;
    private logStream;
    private commonAttributes;
    constructor(extensionId: string, extensionVersion: string, client: IAnalyticsClient, options?: AnalyticsReporterOptions);
    private updateUserOptIn;
    private initialiseAnalyticsClient;
    private getCommonAttributes;
    sendEvent(event: AnalyticsEvent): void;
    sendException(exception: Exception): void;
    dispose(): Promise<void>;
}
export {};
