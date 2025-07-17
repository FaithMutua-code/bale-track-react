import jwt from 'jsonwebtoken';



const authMiddleware = async(req, res, next) => {

    const {token} = req.headers;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied Login Again' , success: false });
    }

    try {
        // Verify token
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded_token.id;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: 'Invalid token, authorization denied Login Again' , success: false });
    }
}


export default authMiddleware;
