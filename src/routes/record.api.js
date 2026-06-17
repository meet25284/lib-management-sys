import express from "express";
import { isMember } from "../middleware/auth.js";
import { borrowBook, mybook, returnBook } from "../controllers/record.js";

const Recordrouter = express.Router();

Recordrouter.post("/borrow", isMember, async (req, res) => {
    try {
        return await borrowBook(req, res)
        
    } catch (err) {
        res.json({message:"get error"});
    }
})

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