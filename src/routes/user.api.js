import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js"
import { isUser, listUsers, login, otplogin, profile, RegisterUser, verifyotp } from "../controllers/users.js";
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

router.get("/admin/users", isAdmin, async (req, res) => {
    try {
        return await listUsers(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/auth/user", async (req, res) =>{
    try {
        return await isUser(req, res)
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})

export default router;