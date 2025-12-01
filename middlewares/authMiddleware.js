// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Middleware to protect routes
// const protect = async (req, res, next) => {
//     try {
//         let token = req.headers.authorization;

//         if(token && token.startsWith("Bearer")){
//             token = token.split(" ")[1];  // Extract token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select("-password");
//             next();
//         }
//         else{
//             res.status(401).json({ message: "Not authorized, no token" });
//         }
        
//     } catch (error) {
//         res.status(401).json({ message: "Token failed", error: error.message });
//     }
// };

// module.exports = { protect };    
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Remove "Bearer "
        token = token.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ 
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports = { protect };
