import express from "express";
import { isAdmin, isAuthenticated, isCreator } from "../middleware/auth.js"
import { createBook, deleteBook, getallBooks, getBook, search, updateBook } from "../controllers/books.js";
const bookrouter = express.Router();

bookrouter.post("/books", isCreator, async (req, res) => {
    try {
        return await createBook(req,res);
    } catch (error) {
        res.json(message.error)
    }
    
})

bookrouter.get("/books", isAuthenticated, async (req, res) => {
    
    try {
        return await getallBooks(req,res)
    }
    catch (err) {
        res.json(message.err);
    }

})

bookrouter.get("/books/:isbn", isAuthenticated, async (req, res) => {
    try {
        return await getBook(req, res)

    }
    catch (err) {
        res.json(message.err);
    }
})

bookrouter.put("/books/:id", isCreator, async (req, res) => {
    try {

        return await updateBook(req, res)

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

bookrouter.patch("/books/:id", isAdmin, async (req, res) => {
    try {
        return await deleteBook(req, res)
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

bookrouter.get("/search", isAuthenticated, async (req, res) => {
    try {
        return await search(req, res)
    }
    catch (err) {
        res.json(message.err);
    }
});

export default bookrouter;