import { Schema, model,mongoose } from "mongoose";
import User from "./UserSchema.js";

const borrowSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: User
        },

        isbn: {
            type: String,
            required: true,
        },

        borrowDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: {
            type: Date,
            default: () => {
                const date = new Date();
                date.setDate(date.getDate() + 14);
                return date;
            }
        },

        returnDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["borrowed", "returned", "overdue"],
            default: "borrowed",
        },
        isDeleted:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Borrow = model("Borrow", borrowSchema);

export default Borrow;