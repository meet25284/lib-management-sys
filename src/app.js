import express from "express";
import cors from "cors";
import router from "./routes/user.api.js";
import bookrouter from "./routes/book.api.js";
import Recordrouter from "./routes/record.api.js";
import routerDashboard from "./routes/dashboard.api.js";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.use("/api/", router);
app.use("/api/", bookrouter);
app.use("/api/", Recordrouter);
app.use("/api/", routerDashboard);

export default app;
