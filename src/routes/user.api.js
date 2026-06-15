import express from "express";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import { createToken } from "../controllers/helper.js";
import {isAuthenticated} from "../middleware/auth.js"
import { emailvalidation,passwordvalidation} from "../validations/validate.js";
const router = express.Router();

router.post("/auth/register", async (req, res) => {
    try {
        if (req.body.name && req.body.email && req.body.password && req.body.role) {
            if (!emailvalidation(req.body.email)) {
                return res.status(400).json({ message: "Invalid email" });
            } else if (!passwordvalidation(req.body.password)) {
                return res.status(400).json({ message: "password must be more than 8 character" });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
            });
            await User.create(user);
            res.status(200).json({ message: "User created successfully" });
        } else {
            res.status(400).json({ message: "All fields are required" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        if (!emailvalidation(req.body.email)) {
            return res.status(400).json({ message: "Invalid email" });
        } else if (!passwordvalidation(req.body.password)) {
            return res.status(400).json({ message: "password must be more than 8 character" });
        }

        else {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
                if (isPasswordValid) {
                    const token = createToken(user._id);
                    res.status(200).json({ message: "Login successful", token: token });
                }
            } else {
                return res.status(400).json({ message: "User not found" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/auth/profile", isAuthenticated, async (req, res) => {
    try {

        const user = req?.me;
        if (user?._id) {
            res.status(200).json({
                name: user.name,
                role: user.role
            });
        } else {
            res.status(404).json({ message: "user not found" });

        }
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
})

export default router;