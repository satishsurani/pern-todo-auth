const jwt = require('jsonwebtoken');
const { responde } = require('../utils/responseHandler');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    try {
        if (!token) return responde(res, 401, 'Access Denied. No token availble')
        const decode = jwt.verify(token, process.env.JWT_SECERET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        console.error('Error during authMiddleware:', error);
        return responde(res, 401, 'invalid token');
    }
}

module.exports = { authMiddleware }