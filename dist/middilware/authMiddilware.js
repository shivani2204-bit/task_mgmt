import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // const token = req.headers['authorization']?.split(' ')[1] || req.cookies.accessToken;

    if (!token) {
        return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};