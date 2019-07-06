import { IAnalyticsClient } from "./base-client"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import * as vscode from "vscode"
import { AnalyticsEvent, Exception, Attributes } from "./events"

export class AnalyticsReporter {
    private extensionId: string
    private extensionVersion: string
    private analyticsClient: IAnalyticsClient
    private userOptIn: boolean = false
    private readonly configListener: vscode.Disposable

    private static TELEMETRY_CONFIG_ID = "telemetry"
    private static TELEMETRY_CONFIG_ENABLED_ID = "enableTelemetry"

    private logStream: fs.WriteStream | undefined

    private commonAttributes: Attributes = {}

    constructor(
        extensionId: string,
        extensionVersion: string,
        client: IAnalyticsClient
    ) {
        let logFilePath = process.env["VSCODE_LOGS"] || ""
        if (
            logFilePath &&
            extensionId &&
            process.env["VSCODE_LOG_LEVEL"] === "trace"
        ) {
            logFilePath = path.join(logFilePath, `${extensionId}.txt`)
            this.logStream = fs.createWriteStream(logFilePath, {
                flags: "a",
                encoding: "utf8",
                autoClose: true
            })
        }
        this.extensionId = extensionId
        this.extensionVersion = extensionVersion
        this.analyticsClient = client
        this.updateUserOptIn()
        this.configListener = vscode.workspace.onDidChangeConfiguration(() =>
            this.updateUserOptIn()
        )
    }

    private updateUserOptIn(): void {
        const config = vscode.workspace.getConfiguration(
            AnalyticsReporter.TELEMETRY_CONFIG_ID
        )
        this.userOptIn = config.get<boolean>(
            AnalyticsReporter.TELEMETRY_CONFIG_ENABLED_ID,
            true
        )
        if (this.userOptIn) {
            this.initialiseAnalyticsClient()
        } else {
            this.dispose()
        }
    }

    private initialiseAnalyticsClient() {
        this.commonAttributes = this.getCommonAttributes()

        this.analyticsClient.initialise()
    }

    // __GDPR__COMMON__ "common.os" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.platformversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extname" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extversion" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodemachineid" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodesessionid" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodeversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    private getCommonAttributes(): Attributes {
        const commonAttributes: Attributes = {}
        commonAttributes["common.os"] = os.platform()
        commonAttributes["common.platformversion"] = (
            os.release() || ""
        ).replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, "$1$2$3")
        commonAttributes["common.extname"] = this.extensionId
        commonAttributes["common.extversion"] = this.extensionVersion
        if (vscode && vscode.env) {
            commonAttributes["common.vscodemachineid"] = vscode.env.machineId
            commonAttributes["common.vscodesessionid"] = vscode.env.sessionId
            commonAttributes["common.vscodeversion"] = vscode.version
        }
        return commonAttributes
    }

    sendEvent(event: AnalyticsEvent): void {
        if (this.userOptIn && this.analyticsClient) {
            event.update(this.commonAttributes)
            this.analyticsClient.sendEvent(event)

            if (this.logStream) {
                this.logStream.write(
                    `telemetry/${event.getName()} ${JSON.stringify(
                        event.toJSON()
                    )}\n`
                )
            }
        }
    }

    sendException(exception: Exception): void {
        if (this.userOptIn) {
            exception.update(this.commonAttributes)
            this.analyticsClient.sendException(exception)

            if (this.logStream) {
                this.logStream.write(
                    `telemetry/${exception.getName()} ${exception.getMessage()} ${JSON.stringify(
                        exception.toJSON()
                    )}\n`
                )
            }
        }
    }

    async dispose(): Promise<void> {
        this.configListener.dispose();

        const flushEventsToLogger = new Promise<void>(resolve => {
            if (this.logStream) {
                this.logStream.on("finish", resolve)
                this.logStream.end()
            } else {
                return resolve(void 0)
            }
        })

        const flushEventsToAI = new Promise<void>(resolve => {
            if (this.analyticsClient) {
                return this.analyticsClient.flush()
            } else {
                resolve(void 0)
            }
        })

        await Promise.all([flushEventsToAI, flushEventsToLogger])
    }
}
