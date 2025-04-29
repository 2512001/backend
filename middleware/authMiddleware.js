const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.access_token; 
        

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            }

            req.user = decoded;
            next(); 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

