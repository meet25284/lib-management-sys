import express from "express";
import { isAuthenticated } from "../middleware/auth.js"
import { login, otplogin, profile, RegisterUser, verifyotp } from "../controllers/users.js";
const router = express.Router();

router.post("/auth/register", async (req, res) => {
    try {
        return await RegisterUser(req, res)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/auth/otplogin", async (req, res) => {
    try {
        return await otplogin(req, res)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/auth/verifyOTP", async (req, res) => {
    try {
        return await verifyotp(req, res)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post("/auth/login", async (req, res) => {
    try {
        return await login(req , res);}
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/auth/profile", isAuthenticated, async (req, res) => {
    try {
        return await profile (req, res);
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
})

export default router;