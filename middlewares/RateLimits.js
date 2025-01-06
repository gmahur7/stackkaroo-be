const rateLimit = require('express-rate-limit');
const moment = require('moment'); 

exports.loginRateLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5,
    message: {
      success: false,
      message: "Too many login attempts. Please try again after 30 minutes.",
    },
    handler: (req, res) => {
      const resetTime = moment(req.rateLimit.resetTime).format('YYYY-MM-DD HH:mm:ss');
      res.status(429).json({
        success: false,
        message: `Too many login attempts. Try again after ${resetTime}.`,
      });
    },
    standardHeaders: true, 
    legacyHeaders: false,
  });