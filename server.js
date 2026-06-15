import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import router from "./src/routes/user.api.js";
import bookrouter from "./src/routes/book.api.js";


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

app.use("/api/", router);
app.use("/api/", bookrouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));