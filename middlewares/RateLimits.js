const moment = require('moment');
const LoginAttempt = require('../models/LoginRateLimitSchema'); // Path to your MongoDB model

// Middleware to track login attempts
exports.loginRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    let loginAttempt = await LoginAttempt.findOne({ ip });

    const windowMs = 30 * 60 * 1000; 
    const maxAttempts = 5;

    if (!loginAttempt) {
      loginAttempt = new LoginAttempt({
        ip,
        attempts: 1,
        lastAttempt: Date.now(),
        resetTime: Date.now() + windowMs, 
      });
      await loginAttempt.save();
    } else {
      const now = Date.now();
      
      if (now < loginAttempt.resetTime) {
        if (loginAttempt.attempts >= maxAttempts) {
          const resetTime = moment(loginAttempt.resetTime).format('YYYY-MM-DD HH:mm:ss');
          return res.status(429).json({
            success: false,
            message: `Too many login attempts. Try again after ${resetTime}.`,
          });
        } else {
          loginAttempt.attempts += 1;
          loginAttempt.lastAttempt = now;
          await loginAttempt.save();
        }
      } else {
        loginAttempt.attempts = 1;
        loginAttempt.lastAttempt = now;
        loginAttempt.resetTime = now + windowMs;
        await loginAttempt.save();
      }
    }
    next();
  } catch (error) {
    console.error("Error tracking login attempts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.resetLoginAttempts = async (req, res) => {
  try {
    const { ip } = req.ip;

    if (ip) {
      const loginAttempt = await LoginAttempt.findOne({ ip });

      if (!loginAttempt) {
        return res.status(404).json({
          success: false,
          message: `No login attempts found for IP: ${ip}.`,
        });
      }

      loginAttempt.attempts = 0;
      loginAttempt.resetTime = Date.now(); 
      await loginAttempt.save();

      return res.status(200).json({
        success: true,
        message: `Login attempts for IP ${ip} have been reset.`,
      });
    } else {
      await LoginAttempt.updateMany({}, { $set: { attempts: 0, resetTime: Date.now() } });

      return res.status(200).json({
        success: true,
        message: 'Login attempts for all IPs have been reset.',
      });
    }
  } catch (error) {
    console.error('Error resetting login attempts:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

