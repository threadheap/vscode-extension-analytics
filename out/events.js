"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnalyticsEvent = /** @class */ (function () {
    function AnalyticsEvent(action, attributes) {
        this.action = action;
        this.attributes = attributes;
    }
    AnalyticsEvent.prototype.update = function (attributes) {
        Object.assign(this.attributes, attributes);
    };
    AnalyticsEvent.prototype.getName = function () {
        return this.action;
    };
    AnalyticsEvent.prototype.toJSON = function () {
        return {
            action: this.action,
            attributes: this.attributes
        };
    };
    return AnalyticsEvent;
}());
exports.AnalyticsEvent = AnalyticsEvent;
var Exception = /** @class */ (function () {
    function Exception(error, attributes) {
        this.error = error;
        this.attributes = attributes;
    }
    Exception.prototype.update = function (attributes) {
        Object.assign(this.attributes, attributes);
    };
    Exception.prototype.getName = function () {
        return this.error.name;
    };
    Exception.prototype.getMessage = function () {
        return this.error.message;
    };
    Exception.prototype.toJSON = function () {
        return {
            error: this.error.name,
            message: this.error.message,
            attributes: this.attributes,
            stack: this.error.stack
        };
    };
    return Exception;
}());
exports.Exception = Exception;
