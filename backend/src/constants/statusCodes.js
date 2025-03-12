const STATUS_CODES = {
  // Success Codes
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202, // Request accepted but not completed yet
  NO_CONTENT: 204, // Request successful, no response body

  //  Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402, // Reserved for future use (e.g., paywall)
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405, // HTTP method not allowed on this route
  CONFLICT: 409, // Conflict with current resource state
  PAYLOAD_TOO_LARGE: 413, // Request entity too large
  UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported content type

  //Rate Limiting & Timeouts
  TOO_MANY_REQUESTS: 429, // Rate limit exceeded
  REQUEST_TIMEOUT: 408, // Request took too long

  //  Server Errors
  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501, // Server doesn't support the functionality
  BAD_GATEWAY: 502, // Invalid response from upstream server
  SERVICE_UNAVAILABLE: 503, // Server is temporarily down
  GATEWAY_TIMEOUT: 504, // Upstream server timeout
};

export default STATUS_CODES;
