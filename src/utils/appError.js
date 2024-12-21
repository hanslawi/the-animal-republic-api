class AppError extends Error {
  constructor(errorMessage, errorStatusCode) {
    super();
    this.message = errorMessage;
    this.status = errorStatusCode;
  }
}

module.exports = AppError;
