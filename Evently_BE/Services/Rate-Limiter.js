const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 60 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: 429,
      error: "You are doing that too much. Try again in 15 minutes.",
    },
  });

module.exports = limiter;