import express from "express";
import { isAdmin } from "../middleware/auth.js";
import { dashboard } from "../controllers/dashboard.js";

const routerDashboard = express.Router();

routerDashboard.get("/dashboard", isAdmin, async (req, res)=>{
    try {
        return await dashboard(req,res);
    } catch (error) {
        res.json({message:error.message})
        
    }
})

export default routerDashboard;