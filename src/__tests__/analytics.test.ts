import { IAnalyticsClient } from "../base-client"
import { AnalyticsReporter } from "../analytics"
import { AnalyticsEvent, Exception } from "../events"
import * as vscodeMock from "vscode"

class MockClient implements IAnalyticsClient {
    initialise = jest.fn()

    sendEvent = jest.fn()

    sendException = jest.fn()

    flush = jest.fn(() => Promise.resolve())
}

const mockConfig = {
    get: jest.fn(() => true)
}

const mockConfigListener = {
    dispose: jest.fn()
}

const workspaceMock = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDidChangeConfiguration: jest.fn(handler => mockConfigListener),
    getConfiguration: jest.fn(() => mockConfig)
}

jest.mock("vscode")

describe("AnalyticsReporter", () => {
    const extensionId = "myext"
    const extensionVersion = "1.0.0"
    const machineId = "machine"
    const sessionId = "sessionId"
    let reporter: AnalyticsReporter
    let client: MockClient

    beforeEach(() => {
        ; (vscodeMock as any).workspace = workspaceMock
            ; (vscodeMock as any).env = {
                machineId,
                sessionId
            }
        client = new MockClient()
        reporter = new AnalyticsReporter(extensionId, extensionVersion, client)
    })

    test("should initialise reporter", () => {
        expect(workspaceMock.onDidChangeConfiguration).toBeCalled()

        const handler = workspaceMock.onDidChangeConfiguration.mock.calls[0][0]

        expect(handler).toBeDefined()

        handler()

        expect(client.initialise).toBeCalled()
    })

    test("should send event", () => {
        const event = new AnalyticsEvent("clicked", { foo: "foo" })

        reporter.sendEvent(event)

        expect(client.sendEvent).toHaveBeenCalledWith(event)
        expect(event.toJSON()).toEqual({
            action: "clicked",
            attributes: {
                foo: "foo",
                "common.extname": extensionId,
                "common.extversion": extensionVersion,
                "common.os": expect.any(String),
                "common.platformversion": expect.any(String),
                "common.vscodemachineid": machineId,
                "common.vscodesessionid": sessionId,
                "common.vscodeversion": undefined
            }
        })
    })

    test("should send exception", () => {
        const exception = new Exception(new Error("Stack overflow"), {
            foo: "foo"
        })

        reporter.sendException(exception)

        expect(client.sendException).toHaveBeenCalledWith(exception)
        expect(exception.toJSON()).toEqual({
            error: "Error",
            message: "Stack overflow",
            stack: expect.anything(),
            attributes: {
                foo: "foo",
                "common.extname": extensionId,
                "common.extversion": extensionVersion,
                "common.os": expect.any(String),
                "common.platformversion": expect.any(String),
                "common.vscodemachineid": machineId,
                "common.vscodesessionid": sessionId,
                "common.vscodeversion": undefined
            }
        })
    })

    test("should dispose, when user opts out", async () => {
        const configChangeHandler =
            workspaceMock.onDidChangeConfiguration.mock.calls[0][0]

        expect(client.initialise).toBeCalled()

        mockConfig.get.mockReturnValue(false)

        configChangeHandler()

        expect(mockConfigListener.dispose).toHaveBeenCalled()
    })
})
