import { Schema, model } from "mongoose";

const borrowSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },

    bookId: {
      type: ObjectId,
      required: true,
    },

    borrowDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Borrow", borrowSchema);