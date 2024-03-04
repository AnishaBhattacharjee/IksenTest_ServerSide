const jwt = require('jsonwebtoken')   

const verifyToken1 = async (req, res, next) => {

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ status: false, message: "A token is required for authentication" });
    }
    else {   
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next()
        } catch (err) {
            return res.status(401).send({ status: false, message: "invalid Token Access" });
        }
    }  
}


const verifyToken2 = async (req, res, next) => {

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ "status": false, "message": "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
    } catch (err) {
        return res.status(401).send({ "status": false, "message": "Only Admin is allowed" });
    }
    return next();
}


module.exports={
    verifyToken1,
    verifyToken2
}