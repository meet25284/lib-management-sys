import { getMe } from "../middleware/auth.js";
import Book from "../models/BookSchema.js";
import Borrow from "../models/RecordSchema.js";

export const borrowBook = async (req, res) => { 
    try {
        if (!req.body.isbn) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const token = req.header("Authorization");
        const user = await getMe(token);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const book = await Book.findOne({
            isbn: req.body.isbn,
            isDeleted: false
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        const max = await Borrow.find({userId:user._id,returnDate:null})
        if(Object.keys(max).length > 5){
            return res.json({message:"you can borrow max to max 5 books"})
        }
        const borrow = await Borrow.create({
            userId: user._id,
            isbn: book.isbn,
            status: "borrowed"
        });

        return res.status(200).json({
            message: "Borrow successful",
            borrow
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

export const returnBook = async (req, res) => {
    try {
        if (!req.body.isbn) {
            return res.status(400).json({
                message: "ISBN is required"
            });
        }

        const token = req.header("Authorization");
        const user = await getMe(token);

                console.log("🚀 ~ returnBook ~ user._id:", user._id)
        const update = await Borrow.findOneAndUpdate(
            {
                userId: user._id,
                isbn: req.body.isbn,
                status: "borrowed"
            },
            {
                $set: {
                    status: "returned",
                    returnDate: new Date()
                }
            },
            {
                new: true
            }
        );

        if (!update) {
            return res.status(404).json({
                message: "Borrow record not found"
            });
        }

        return res.status(200).json({
            message: "Return successful",
            data: update
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const mybook = async (req,res)=>{
    try {
        const token = req.header("Authorization");
        const user = await getMe(token);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

            console.log("🚀 ~ mybook ~ user._id:", user._id)
        const books = await Borrow.find({
            userId:user._id,
            isDeleted: false
        });
        console.log("🚀 ~ mybook ~ books:", typeof(books))

        return res.status(200).json({message:"your books",books},books)
    } catch (err) {
        res.json({message:err.message})
        
    }
}