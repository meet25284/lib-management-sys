import mongoose from "mongoose";
import "dotenv/config";
import app from "./src/app.js";
import { startDailyReminders, updateStatus } from "./src/cron/remainder.js";
import logger from "./src/utils/logger.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
    startDailyReminders();
    updateStatus();
  })
  .catch((err) => logger.error("MongoDB connection failed", { err }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
