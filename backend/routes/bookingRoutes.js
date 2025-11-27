import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  stripePayment,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

// Initializing the Express router for booking-related routes

const bookingRouter = express.Router();

//Check room availability based on selected dates and hotel
bookingRouter.post("/check-availability", checkAvailabilityAPI);

//Create a new booking for an authenticated user
bookingRouter.post("/book", protect, createBooking);

//Retrieve all bookings made by the logged-in user
bookingRouter.get("/user", protect, getUserBookings);

//Retrieve all bookings associated with a specific hotel (admin/manager use)
bookingRouter.get("/hotel", protect, getHotelBookings);

//Process payment with Stripe for a booking
bookingRouter.post("/stripe-payment", protect, stripePayment);

export default bookingRouter;
