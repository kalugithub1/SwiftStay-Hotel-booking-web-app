// function to check availability of the room

import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability of the room
// POST  /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to create a new booking
//POST /api/bookings/book

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;
    const clientEmail = req.user.email;
    const clientName = req.user.username || "Valued Client";
    //Before Booking check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    //calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // --- START EMAIL LOGIC ---
    // Prepare data for the email template
    const currencySymbol = process.env.CURRENCY || "$";
    const formattedTotalPrice = booking.totalPrice.toFixed(2);

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4A90E2; padding: 20px; color: white;">
                <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
            </div>
            <div style="padding: 20px;">
                <p>Dear ${clientName},</p>
                <p>Thank you for choosing us! Your booking has been successfully confirmed. Here are your details:</p>
                
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px dashed #eee;">Booking ID:</td>
                        <td style="padding: 8px 0; border-bottom: 1px dashed #eee; text-align: right;">${
                          booking._id
                        }</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px dashed #eee;">Hotel:</td>
                        <td style="padding: 8px 0; border-bottom: 1px dashed #eee; text-align: right;">${
                          roomData.hotel.name
                        }</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px dashed #eee;">Room Type:</td>
                        <td style="padding: 8px 0; border-bottom: 1px dashed #eee; text-align: right;">${
                          roomData.roomType || "Standard"
                        }</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px dashed #eee;">Check-in Date:</td>
                        <td style="padding: 8px 0; border-bottom: 1px dashed #eee; text-align: right;">${new Date(
                          booking.checkInDate
                        ).toDateString()}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px 0; border-bottom: 1px dashed #eee;">Check-out Date:</td>
                        <td style="padding: 8px 0; border-bottom: 1px dashed #eee; text-align: right;">${new Date(
                          booking.checkOutDate
                        ).toDateString()}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px 0;">Total Guests:</td>
                        <td style="padding: 8px 0; text-align: right;">${
                          booking.guests
                        }</td>
                    </tr>
                </table>
                
                <div style="margin-top: 30px; text-align: center; background-color: #f7f7f7; padding: 15px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>Total Booking Amount:</strong></p>
                    <h2 style="color: #E94C3D; margin-top: 5px;">${currencySymbol} ${formattedTotalPrice}</h2>
                </div>

                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #777;">
                    Please contact us if you need to make any amendments to your booking.
                </p>
            </div>
            <div style="background-color: #f2f2f2; padding: 10px; text-align: center; font-size: 11px; color: #555;">
                This confirmation was sent to ${clientEmail}.
            </div>
        </div>
    `;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: clientEmail, // Use the extracted clientEmail
      subject: `[Confirmed] Your Hotel Booking at ${roomData.hotel.name}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.json({ success: false, message: "Fail to create Booking" });
  }
};

// API to get all bookings for a user
//GET  /api/bookings/user

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, message: bookings });
  } catch (error) {
    res.json({ success: false, message: "Fail to fetch bookings" });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth().userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    //Total Bookings

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Fail to fetch bookings" });
  }
};

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    // create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: "Payment Fail" });
  }
};
