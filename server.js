import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import router from "./src/routes/user.api.js";
import bookrouter from "./src/routes/book.api.js";
import Recordrouter from "./src/routes/record.api.js"
import routerDashboard from "./src/routes/dashboard.api.js";
import { startDailyReminders, updateStatus } from "./src/cron/remainder.js";
import morgan from "morgan";
import logger from "./src/utils/logger.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  logger.info("Connected to MongoDB");
  startDailyReminders();
  updateStatus();
})
.catch((err) => logger.error("MongoDB connection failed", { err }));

app.use("/api/", router);
app.use("/api/", bookrouter);
app.use("/api/", Recordrouter);
app.use("/api/", routerDashboard);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));