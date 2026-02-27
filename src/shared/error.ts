/**
 * The reasons to throw ResourceError
 */
export enum ResourceErrorReason {
    BAD_REQUEST = "BadRequest",
    INVALID_ACCESS = "InvalidAccess",
    FORBIDDEN = "Forbidden",
    NOT_FOUND = "NotFound",
    CONFLICT = "Conflict",
    TOO_MANY_REQUEST = "TooManyRequest",
    TOO_EARLY = "TooEarly",
    INTERNAL_SERVER_ERROR = "InternalServiceError",
}

/**
 * Defines an error involving a specific resource in the service.
 */
export class ResourceError extends Error {
    public additionalInformation: Record<string, any>;
    constructor(
        message: string,
        type: ResourceErrorReason,
        additionalInformation: Record<string, any>,
    ) {
        super(message);
        this.name = type;
        this.additionalInformation = additionalInformation;
    }
}

/**
 * For DTO Errors
 */
export class DtoValidationError {
    public name: string;
    public message: {
        property: string;
        errorMsg: string;
    };
    constructor(message: any, type: ResourceErrorReason) {
        this.name = type;
        this.message = message;
    }
}