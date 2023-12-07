const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = async (request, response, next) => {
    const token = request.headers.authorization;

    try {
        if (!token) {
            throw new Error("Aucun token fourni");
        }

        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_KEY);
        request.userData = decoded;
        next();
    } catch (error) {
        console.error("Erreur de vérification du token :", error);

        return response.status(403).json({ message: "Token invalide", error: error.message });
    }
};
