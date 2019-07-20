"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var os = require("os");
var path = require("path");
var vscode = require("vscode");
var AnalyticsReporter = /** @class */ (function () {
    function AnalyticsReporter(extensionId, extensionVersion, client, options) {
        var _this = this;
        this.userOptIn = false;
        this.telemetryConfigId = "telemetry";
        this.telemetryConfigEnabledId = "enableTelemetry";
        this.commonAttributes = {};
        var logFilePath = process.env["VSCODE_LOGS"] || "";
        if (logFilePath &&
            extensionId &&
            process.env["VSCODE_LOG_LEVEL"] === "trace") {
            logFilePath = path.join(logFilePath, extensionId + ".txt");
            this.logStream = fs.createWriteStream(logFilePath, {
                flags: "a",
                encoding: "utf8",
                autoClose: true
            });
        }
        if (options) {
            if (options.configId) {
                this.telemetryConfigId = options.configId;
            }
            if (options.configEnabledId) {
                this.telemetryConfigEnabledId = options.configEnabledId;
            }
        }
        this.extensionId = extensionId;
        this.extensionVersion = extensionVersion;
        this.analyticsClient = client;
        this.updateUserOptIn();
        this.configListener = vscode.workspace.onDidChangeConfiguration(function () {
            return _this.updateUserOptIn();
        });
    }
    AnalyticsReporter.prototype.updateUserOptIn = function () {
        var config = vscode.workspace.getConfiguration(this.telemetryConfigId);
        this.userOptIn = config.get(this.telemetryConfigEnabledId, true);
        if (this.userOptIn) {
            this.initialiseAnalyticsClient();
        }
        else {
            this.dispose();
        }
    };
    AnalyticsReporter.prototype.initialiseAnalyticsClient = function () {
        this.commonAttributes = this.getCommonAttributes();
        this.analyticsClient.initialise();
    };
    // __GDPR__COMMON__ "common.os" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.platformversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extname" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extversion" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodemachineid" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodesessionid" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodeversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    AnalyticsReporter.prototype.getCommonAttributes = function () {
        var commonAttributes = {};
        commonAttributes["common.os"] = os.platform();
        commonAttributes["common.platformversion"] = (os.release() || "").replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, "$1$2$3");
        commonAttributes["common.extname"] = this.extensionId;
        commonAttributes["common.extversion"] = this.extensionVersion;
        if (vscode && vscode.env) {
            commonAttributes["common.vscodemachineid"] = vscode.env.machineId;
            commonAttributes["common.vscodesessionid"] = vscode.env.sessionId;
            commonAttributes["common.vscodeversion"] = vscode.version;
        }
        return commonAttributes;
    };
    AnalyticsReporter.prototype.sendEvent = function (event) {
        if (this.userOptIn && this.analyticsClient) {
            event.update(this.commonAttributes);
            this.analyticsClient.sendEvent(event);
            if (this.logStream) {
                this.logStream.write("telemetry/" + event.getName() + " " + JSON.stringify(event.toJSON()) + "\n");
            }
        }
    };
    AnalyticsReporter.prototype.sendException = function (exception) {
        if (this.userOptIn) {
            exception.update(this.commonAttributes);
            this.analyticsClient.sendException(exception);
            if (this.logStream) {
                this.logStream.write("telemetry/" + exception.getName() + " " + exception.getMessage() + " " + JSON.stringify(exception.toJSON()) + "\n");
            }
        }
    };
    AnalyticsReporter.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var flushEventsToLogger, flushEventsToAI;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.configListener.dispose();
                        flushEventsToLogger = new Promise(function (resolve) {
                            if (_this.logStream) {
                                _this.logStream.on("finish", resolve);
                                _this.logStream.end();
                            }
                            else {
                                return resolve(void 0);
                            }
                        });
                        flushEventsToAI = new Promise(function (resolve) {
                            if (_this.analyticsClient) {
                                return _this.analyticsClient.flush();
                            }
                            else {
                                resolve(void 0);
                            }
                        });
                        return [4 /*yield*/, Promise.all([flushEventsToAI, flushEventsToLogger])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AnalyticsReporter;
}());
exports.AnalyticsReporter = AnalyticsReporter;
