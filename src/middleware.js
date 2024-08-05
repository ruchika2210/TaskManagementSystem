

const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);

    if (!authHeader) {
        console.log('No Authorization header found');
        return res.status(401).json({ message: 'token not provided' }); 
    }

    const token = authHeader.replace('Bearer ', '').trim(); 
    console.log('Token extracted:', token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Token decoded successfully:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
