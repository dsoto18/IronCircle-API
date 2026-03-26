import { Request, NextFunction } from "express";
import { AbstractDto } from "./abstract-dto";

export function Dto(dto: new (req: Request) => AbstractDto): MethodDecorator {
    return function (
        _: any,
        __: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const request = args[0] as Request;
            const next = args[2] as NextFunction;
            
            try {
                const dtoObject = new dto(request);

                // validate the dto
                await dtoObject.isDtoValid();

                // FIX: Ensure request.body is an object before assigning to it.
                // If it's undefined (common in GET requests), initialize it as {}.
                if (!request.body) {
                    request.body = {};
                }

                // Now this line won't throw "Cannot set properties of undefined"
                request.body.dto = dtoObject;

                // call the original function
                return original.apply(this, args);
            } catch (error) {
                console.log(error);
                return next(error);
            }
        };
    };
}