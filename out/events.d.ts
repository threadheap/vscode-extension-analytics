declare type Primitive = string | number | null | void;
interface PrimitiveHash {
    [key: string]: Primitive;
}
declare type Attribute = Primitive | Primitive[] | PrimitiveHash | PrimitiveHash[];
export interface Attributes {
    [key: string]: Attribute;
}
export declare class AnalyticsEvent {
    action: string;
    attributes: Attributes;
    constructor(action: string, attributes: Attributes);
    update(attributes: Attributes): void;
    getName(): string;
    toJSON(): {
        action: string;
        attributes: Attributes;
    };
}
export declare class Exception {
    error: Error;
    attributes: Attributes;
    constructor(error: Error, attributes: Attributes);
    update(attributes: Attributes): void;
    getName(): string;
    getMessage(): string;
    toJSON(): {
        error: string;
        message: string;
        attributes: Attributes;
        stack: string | undefined;
    };
}
export {};
