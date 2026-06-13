import mongoose, { Schema } from "mongoose";

const bookschema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    isbn: { type: String, immutable: true, required: true },
    description: { type: String, required: true },
    totalCopies: { type: Number, required: true },
    availableCopies: { type: Number, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const Book = mongoose.model("Book", bookschema);

export default Book;