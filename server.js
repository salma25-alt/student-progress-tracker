
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import progressRouter from "./routes/progress.js"
import path from "path"
import cors from "cors"

const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.static("public"));
app.use("/api/progress", progressRouter)

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"))
});


// Connect to MongoDB before starting the server
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");


        app.listen(process.env.PORT || 5010, () => {
            console.log(`Server is running..`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
