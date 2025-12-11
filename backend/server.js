import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectUsingMongoose } from "./src/config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./src/features/users/user.routes.js";
import detailsRouter from "./src/features/dashboard/details/details.routes.js";
import documentRouter from "./src/features/dashboard/document/document.routes.js";
import historyRouter from "./src/features/dashboard/history/history.routes.js";
import linkRouter from "./src/features/dashboard/link/link.routes.js";
import chatbotRouter from "./src/features/chatbot/chatbot.routes.js";
import TicketRouter from "./src/features/dashboard/tickets/ticket.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads (serve uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//  Serve widget.js and other static JS files
app.use("/static", express.static(path.join(__dirname, "src/static")));

// Connect DB
connectUsingMongoose();

// Routes
app.use("/users", userRouter);
app.use("/details", detailsRouter);
app.use("/documents", documentRouter);
app.use("/history", historyRouter);
app.use("/link", linkRouter);
app.use("/chatbot", chatbotRouter);
app.use("/tickets", TicketRouter);

// basic health
app.get("/", (req, res) => res.send("Chatbot backend running"));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`=> Server running on port ${PORT}`));
