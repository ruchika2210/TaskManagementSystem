const jwt = require('jsonwebtoken');

exports.authenticate = (req,res,next) =>{
    const token = req.header('Authorization').replace('Bearer ','');
    try {
        const verifymessage = jwt.verify(token,process.env.SECRET);
        req.user=verifymessage;
        next();
    } catch (error) {
        req.status(401).json({message:'Please perform the authentication'});
    }
}