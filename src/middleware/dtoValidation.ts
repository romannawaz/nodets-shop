import { NextFunction, Request, RequestHandler, Response } from "express";

import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { sanitize } from "class-sanitizer";

export const dtoValidationMiddleware =
  (type: any, skipMissingProperties = false): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);

    validate(dtoObj, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors
            .map((error: ValidationError) =>
              (Object as any).values(error.constraints)
            )
            .join(", ");

          return res.status(422).json({ message: dtoErrors });
        } else {
          sanitize(dtoObj);
          req.body = dtoObj;

          next();
        }
      }
    );
  };
