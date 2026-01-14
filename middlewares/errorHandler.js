/**
 * Global Error Handling Middleware for Express.
 * * This function catches all errors passed via `next()` or thrown in synchronous routes.
 * It centralizes error logging and ensures the API always returns a structured JSON 
 * response instead of crashing or leaking stack traces.
 * * @param {Object} err - The error object.
 * @param {number} [err.status] - The HTTP status code (defaults to 500).
 * @param {string} [err.message] - The error description.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * * @returns {void} Sends a JSON response to the client.
 */
function errorHandler(err, req, res, next) {
  // Log the full error to the server console for debugging
  console.error(`[Error] ${new Date().toISOString()}:`, err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ 
    error: message,
    status: status
  });
}

module.exports = { errorHandler };