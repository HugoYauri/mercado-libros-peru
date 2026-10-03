export class HttpError extends Error {
  constructor(status, message, code = "ERROR", details) {
    super(message);
    Object.assign(this, { status, code, details });
  }
}
export function notFound(_req, _res, next) {
  next(new HttpError(404, "Recurso no encontrado.", "NOT_FOUND"));
}
export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error.message);
  res
    .status(status)
    .json({
      error: {
        code: status >= 500 ? "INTERNAL_ERROR" : error.code,
        message:
          status >= 500 ? "No pudimos completar la solicitud." : error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    });
}
