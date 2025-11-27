import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

// Initialize Express router for hotel-related operations
const hotelRouter = express.Router();

//Register a new hotel in the system
hotelRouter.post("/", protect, registerHotel);

export default hotelRouter;
