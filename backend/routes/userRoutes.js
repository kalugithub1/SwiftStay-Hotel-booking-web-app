import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserData,
  storeRecentSearchedCities,
} from "../controllers/userController.js";

// Initialize Express router for user-related operations
const userRouter = express.Router();

//Retrieve profile data for the authenticated user
userRouter.get("/", protect, getUserData);

//Store a city in the user's recent searches list
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);

export default userRouter;
