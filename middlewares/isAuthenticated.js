const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    let token = req.headers[authorization] || req.headers['x-access-token'];
    token = token.split(' ')[1];
    if(!token) {
        return res.status(401).json({success: false, message: "Unauthorized access"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Unauthorized access", error}); 
    }
}

exports.isAdmin = (req, res, next) => {
    if(req.user.role==='admin') {
        next();
    } else {
        return res.status(403).json({success: false, message: "Forbidden access"});
    }
}

exports.generateToken = (user) => {
    return jwt.sign({id: user._id, username: user.username, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
}