import express from "express";
import { ConetentModel, LinkModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import { UserMiddleware } from "./middleware.js";
import { random } from "./utils.js";
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
app.post("/api/v1/signin", async (req, res) => {
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
            token,
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
        tags: [],
        //@ts-ignore
        Author: req.userId
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
app.delete("/api/v1/content", UserMiddleware, async (req, res) => {
    //@ts-ignore
    const contentId = req.body.contentId;
    await ConetentModel.deleteMany({
        contentId,
        userId: req.body.userId
    });
    res.json({
        message: "deleted"
    });
});
app.post("/api/v1/brain/share", UserMiddleware, async (req, res) => {
    const shareId = req.body.share;
    if (shareId) {
        const existingUser = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingUser) {
            return res.status(400).json({
                hash: existingUser.hash,
                message: "Link already exists"
            });
        }
        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash: hash,
            message: "/share/" + hash
        });
    }
    else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    });
    if (!link) {
        return res.status(404).json({ message: "Link not found" });
    }
    const content = await ConetentModel.findOne({
        userId: link.userId
    });
    const user = await UserModel.findOne({
        _id: link.userId
    });
    res.status(200).json({
        username: user?.username,
        content: content
    });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
