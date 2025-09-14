
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export const UserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    //console.log("Authorization Header:", token);

    if (!token) {
        return res.status(403).json({
            message: "No authorization header found",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };

        // @ts-ignore
        req.userId = decoded.id;

        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({
            message: "Invalid or expired token",
        });
    }
};
