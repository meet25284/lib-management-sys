import express from "express";
import { isAdmin, isMember } from "../middleware/auth.js";
import { adminBorrowBook, borrowBook, mybook, returnBook } from "../controllers/record.js";

const Recordrouter = express.Router();

Recordrouter.post("/borrow", isMember, async (req, res) => {
    try {
        return await borrowBook(req, res)
        
    } catch (err) {
        res.json({message:"get error"});
    }
})

Recordrouter.post("/admin/borrow", isAdmin, async (req, res) => {
    try {
        return await adminBorrowBook(req, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

Recordrouter.patch("/return",isMember,async(req, res)=>{
 try {
    return await returnBook(req, res)
    
 } catch (err) {
    res.json(message.err)
    
 }
})


Recordrouter.get("/my-books", isMember , async(req, res)=>{
    try{
        return await mybook(req, res)
    }
    catch (err) {
        res.json({message:err.message})
        
    }
})
export default Recordrouter;