import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMidlleware.js";
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
} from "../controllers/roomController.js";

// Initialize Express router for room-related operations
const roomRouter = express.Router();

//Create a new room with uploaded images (max 4)
roomRouter.post("/", upload.array("images", 4), protect, createRoom);

//Fetch all rooms available for users (public listing)
roomRouter.get("/", getRooms);

//Fetch all rooms available for users (public listing)
roomRouter.get("/owner", protect, getOwnerRooms);

//Enable or disable room availability (for hotel owners)
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);

export default roomRouter;
