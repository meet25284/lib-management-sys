import express from "express";
import User from "../models/schema.js";
import bcrypt from "bcryptjs";
import Book from "../models/BookSchema.js"
import { createToken, emailvalidation, passwordvalidation, verifyToken } from "../controllers/helper.js";
import { isAdmin, isAuthenticated, isLibrarian, isCreator } from "../middleware/auth.js"
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

router.post("/books", isCreator, async (req, res) => {
    if (req.body.title && req.body.author && req.body.category && req.body.isbn && req.body.description && req.body.totalCopies && req.body.availableCopies) {
        const books = new Book({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            isbn: req.body.isbn,
            description: req.body.description,
            totalCopies: req.body.totalCopies,
            availableCopies: req.body.availableCopies
        })
        await Book.create(books);
        res.status(200).json({ message: "book added successfully" });

    }
})

router.get("/books", isAuthenticated, async (req, res) => {
    try {
        const books = await Book.find({ isDeleted: false });
        res.json(books).status(200);
    }
    catch (err) {
        res.json(message.err);
    }

})

router.get("/books/:isbn", isAuthenticated, async (req, res) => {
    try {
        const books = await Book.findOne({ isbn: req.params.isbn, isDeleted: false });
        if (books) {
            res.json(books).status(200);
        }
        else {
            res.status(404).json({ message: "book not found" })
        }

    }
    catch (err) {
        res.json(message.err);
    }
})

router.put("/books/:id", isCreator, async (req, res) => {
    try {

        const allowedUpdates = [
            "title",
            "category",
            "description",
            "author"
        ];

        const updates = Object.keys(req.body);

        const isValidOperation = updates.every(
            field => allowedUpdates.includes(field)
        );

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: "Invalid update fields"
            });
        }
        console.log("book:", req.params.id)
        console.log("book:", req.body)


        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body, {
            isDeleted: false
        },
            {
                new: true,
                runValidators: true
            }
        );
        console.log("book:", book)

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(book);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.patch("/books/:id", isAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true
            },
            {
                new: true
            }
        );

        if (!book) {
            return res.status(404).json({
                message: "book not found"
            });
        }

        res.status(200).json({
            success: true,
            data: book,
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.get("/search", isAuthenticated, async (req, res) => {
    try 
    {
        const title = req.query.title;
        const book = await Book.find({
            title: title
        });
        if (book == undefined) {
            res.json(book);
        }else{
            res.status(404).json({ message:"book not found"});
        }
        }
    catch (err) {
        res.json(message.err);
    }
});
export default router;