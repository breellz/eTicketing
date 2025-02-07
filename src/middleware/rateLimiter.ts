import { rateLimit } from 'express-rate-limit'

//This rate limiter limits the number of requests to 30 per minute, 
// if the limit is exceeded, a 429 status code is returned with 
// a message "Too many requests, please try again later."
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message: "Too many requests, please try again later."
    })
  }
})
