const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = async (req, res, next) => {
    // Option 1
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer Token

    // Option 2
    // const token = req.header("x-auth-token");

    console.log("Check token: ", token);
    // If token not found, send error message
    if (!token) {
        res.status(401).json({
            errors: [
                {
                    msg: "Token not found",
                },
            ],
        });
    }

    // Authenticate token
    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Check user: ", user);
        if (user && user.roleId === 1)
            next();
        else {
            res.status(403).json({
                errors: [
                    {
                        msg: "Fobbiden user",
                    },
                ],
            });
        }
        // req.user = user.email;
        // next();
    } catch (error) {
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid token",
                },
            ],
        });
    }
};

module.exports = authToken;

