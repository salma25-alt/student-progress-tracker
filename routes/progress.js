import express from "express"
const router = express.Router()
import Progress from "../models/Progress.js";

router.post("/", async (req, res) => {
    try {
        const {
            studentName,
            courseName,
            completionPercentage
        } = req.body;


        if (
            typeof studentName !== "string" ||
            typeof courseName !== "string" ||
            studentName.trim() === "" ||
            courseName.trim() === "" ||
            completionPercentage === undefined ||
            completionPercentage === null ||
            completionPercentage === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const percentage = Number(completionPercentage);

        if (
            !Number.isFinite(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Completion must be a number between 0 and 100."
            });
        }

        const progress = await Progress.create({
            studentName,
            courseName,
            completionPercentage: percentage
        });

        return res.status(201).json({
            success: true,
            message: "Student progress added successfully!",
            data: progress
        });

    } catch (error) {
        console.error("Error creating progress:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save student progress."
        });
    }
});


router.get("/", async (req, res) => {
    try {
        const progressEntries = await Progress.find()
            .sort({ lastUpdated: -1 });

        return res.status(200).json({
            success: true,
            count: progressEntries.length,
            data: progressEntries
        });

    } catch (error) {
        console.error("Error fetching progress:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve student progress."
        });
    }
});



export default router