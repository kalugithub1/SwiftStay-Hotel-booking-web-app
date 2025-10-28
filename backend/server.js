import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

connectDB();
connectCloudinary();

const app = express();

/* -------------------------------
   ✅ 1. Configure and enable CORS
--------------------------------- */
const allowedOrigins = [
  "http://localhost:5173", // for Vite or React dev server
  "http://localhost:3000", // optional for create-react-app
  "https://swiftstay-frontend-ftd1sw7x9-kalugithub1s-projects.vercel.app",
  "https://swiftstay.vercel.app", // optional production domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from allowed origins or server-to-server calls
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* -------------------------------
   2. Stripe webhook (before express.json)
--------------------------------- */
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* -------------------------------
   3. Middleware setup
--------------------------------- */
app.use(express.json());
app.use(clerkMiddleware());

/* -------------------------------
   4. Webhook and API routes
--------------------------------- */
app.use("/api/clerk", clerkWebhooks);
app.get("/", (req, res) => res.send("API is working fine"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

/* -------------------------------
   5. Server setup
--------------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
