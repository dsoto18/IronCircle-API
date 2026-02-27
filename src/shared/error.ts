/**
 * The reasons for which a ResourceError may be thrown.
 */
export enum ResourceErrorReason {
    /**
     * Status code 400
     *
     * The request was not formatted correctly
     *
     * The request was missing required fields
     *
     * The request had invalid fields
     *
     * The request had invalid values
     * etc.
     */
    BAD_REQUEST = "BadRequest",

    /**
     * Status code 401
     *
     * The request has no credentials
     *
     * The request has invalid credentials
     */
    INVALID_ACCESS = "InvalidAccess",

    /**
     * Status code 403
     *
     * The request has valid credentials but does not have access to the resource
     * etc.
     */
    FORBIDDEN = "Forbidden",

    /**
     * Status code 404
     *
     * The resource was not found
     * etc.
     */
    NOT_FOUND = "NotFound",

    /**
     * Status code 409
     *
     * The resource already exists
     * etc.
     */
    CONFLICT = "Conflict",

    /**
     * Status code 429
     *
     * The user has made too many requests
     */
    TOO_MANY_REQUEST = "TooManyRequest",

    /**
     * Status code 425
     *
     * The user has a made a request that cannot be completed at the time
     * because another proccess is taking place
     */
    TOO_EARLY = "TooEarly",

    /**
     * Status code 500
     *
     * The server encountered an error
     * etc.
     */
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
 * DTO Errors
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