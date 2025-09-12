import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
export const UserMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decode = jwt.verify(header, JWT_PASSWORD);
    if (decode) {
        //@ts-ignore
        req.userId = decode.id;
        next();
    }
    else {
        res.status(403).json({
            message: "Incorrect user details"
        });
    }
};
