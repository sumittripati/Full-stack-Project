const jwt = require("jsonwebtoken");
const User = require("../schema/user-schema");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ msg: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Use your JWT secret key
        const user = await User.findById(decoded.userID); // Find user by ID
        if (!user) {
            return res.status(401).json({ msg: "User not found. Unauthorized access." });
        }

        req.user = user; // Attach user details to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token. Unauthorized access." });
    }
};

module.exports = authenticateUser;

