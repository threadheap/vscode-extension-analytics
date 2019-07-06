type Primitive = string | number | null | void
interface PrimitiveHash {
    [key: string]: Primitive
}
type Attribute = Primitive | Primitive[] | PrimitiveHash | PrimitiveHash[]

export interface Attributes {
    [key: string]: Attribute
}

export class AnalyticsEvent {
    action: string
    attributes: Attributes

    constructor(action: string, attributes: Attributes) {
        this.action = action
        this.attributes = attributes
    }

    update(attributes: Attributes) {
        Object.assign(this.attributes, attributes)
    }

    getName(): string {
        return this.action
    }

    toJSON() {
        return {
            action: this.action,
            attributes: this.attributes
        }
    }
}

export class Exception {
    error: Error
    attributes: Attributes

    constructor(error: Error, attributes: Attributes) {
        this.error = error
        this.attributes = attributes
    }

    update(attributes: Attributes) {
        Object.assign(this.attributes, attributes)
    }

    getName(): string {
        return this.error.name
    }

    getMessage(): string {
        return this.error.message
    }

    toJSON() {
        return {
            error: this.error.name,
            message: this.error.message,
            attributes: this.attributes,
            stack: this.error.stack
        }
    }
}
