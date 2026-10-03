import { HttpError } from "./errors.js";
export const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success)
    return next(
      new HttpError(
        400,
        "Revisa los filtros ingresados.",
        "VALIDATION_ERROR",
        result.error.flatten().fieldErrors,
      ),
    );
  req.validatedQuery = result.data;
  next();
};
