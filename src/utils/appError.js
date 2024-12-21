class AppError extends Error {
  constructor(errorMessage, errorStatusCode) {
    super(errorMessage);
    this.statusCode = errorStatusCode;
  }
}

module.exports = AppError;
