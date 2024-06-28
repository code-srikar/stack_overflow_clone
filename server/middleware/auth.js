import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        // Check if the Authorization header is present
        if (!req.headers.authorization) {
            console.log("Authorization header missing");
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            console.log("Token missing or malformed");
            return res.status(401).json({ message: "Token missing or malformed" });
        }

        // Verify the token
        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.log("Token verification failed:", error.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Log the decoded data for debugging purposes
        console.log("Decoded token data:", decodedData);

        // Attach user ID to request object
        req.userid = decodedData?.id;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication middleware error:", error);
        res.status(500).json({ message: "Something went wrong in the authentication middleware" });
    }
};

export default auth;
