import express from "express";
import { ConetentModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import { UserMiddleware } from "./middleware.js";
const app = express();
app.use(express.json());
const JWT_PASSWORD = "Areef1ar@";
app.post("/api/v1/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        // Save to DB
        const user = await UserModel.create({ username, password });
        res.json({ message: "User created successfully", user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed" });
    }
});
app.get("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username: username,
        password: password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});
app.post("/api/v1/content", UserMiddleware, async (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    await ConetentModel.create({
        link,
        title,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    return res.json({
        message: "Conetent added"
    });
});
app.get("/api/v1/content", UserMiddleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        if (!userId) {
            return res.json({ error: "Unauthorized" });
        }
        const content = await ConetentModel.find({ userId }).populate("userId", "username");
        res.json({ content });
    }
    catch (err) {
        console.error(err);
        res.json({ error: "Internal Server Error" });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
