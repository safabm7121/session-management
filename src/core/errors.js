export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export const Errors = {
  Conflict: (msg) => new AppError(msg, 409),
  Unauthorized: (msg) => new AppError(msg, 401),
  Forbidden: (msg) => new AppError(msg, 403),
  NotFound: (msg) => new AppError(msg, 404),
  BadRequest: (msg) => new AppError(msg, 400),
};
