import { validate, ValidatorOptions } from "class-validator";
import { DtoValidationError, ResourceErrorReason } from "./error";


export abstract class AbstractDto {
    /**
     * Validates a DTO using class validators
     * @returns True if their were no errors.
     * @throws 400 if their were any validation errors
     */
    public async isDtoValid(opt?: ValidatorOptions): Promise<boolean> {
        const options: ValidatorOptions = {
            whitelist: true,
            validationError: {
                target: false,
            },
            forbidUnknownValues: true,
            ...opt,
        };
        const errors = await validate(this, options);

        if (errors.length === 0) {
            return true;
        }

        // formatting
        const errorMsg = errors
            .filter((error) => !!error.constraints)
            .map((error) => {
                return {
                    property: error.property,
                    message: Object.values(error.constraints ?? {}),
                };
            });

        // remove null values
        errorMsg.forEach((error) => {
            error.message = error.message.filter(
                (message) => message !== undefined,
            );
        });

        throw new DtoValidationError(errorMsg, ResourceErrorReason.BAD_REQUEST);
    }
}