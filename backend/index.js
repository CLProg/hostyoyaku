require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); // Added for Socket.io
const { Server } = require("socket.io"); // Added for Socket.io

const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const userController = require("./controllers/userController");
const { protect, adminOnly } = require("./middleware/authMiddleware");
const reservationRoutes = require("./routes/reservationRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const billingRoutes = require("./routes/billingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

// Create HTTP server to wrap the express app
const server = http.createServer(app);

// Initialize Socket.io with DYNAMIC CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // This allows any Vercel URL or Localhost to connect
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log(`📡 New client connected: ${socket.id}`);

  // Listen for order from KioskReservationMenu.jsx
  socket.on("send_order", (orderData) => {
    console.log("📦 Order received from kiosk:", orderData.id);

    // Broadcast order to KitchenPage.jsx
    io.emit("new_order", orderData);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// --- 1. MIDDLEWARE ---
// UPDATED DYNAMIC CORS FOR EXPRESS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allows main Vercel URL, Vercel preview URLs, and localhost
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// --- 2. ROUTES ---

// Public Auth routes (Login, Signup)
app.use("/api/auth", authRoutes);

// OTP routes (Send/Verify for Reservations)
app.use("/api/otp", otpRoutes);

// Profile routes (PROTECTED)
app.get("/api/profile", protect, userController.getProfile);
app.put("/api/profile", protect, userController.updateProfile);

// Address routes
app.use("/api/address", addressRoutes);

// Reservation routes
app.use("/api/reservations", reservationRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Inventory routes
app.use("/api/inventory", protect, adminOnly, inventoryRoutes);

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Admin routes
app.use("/api/admin", protect, adminOnly, adminRoutes);

// Billing routes
app.use("/api/billing", protect, adminOnly, billingRoutes);

// Notification routes
app.use("/api/notifications", notificationRoutes);

// Review routes
app.use("/api/reviews", reviewRoutes);

// Order routes
app.use("/api/inventory", orderRoutes);

// Protected check route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

// --- 3. SERVER START & DB CHECK ---
// Listen on 0.0.0.0 for Render compatibility
server.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    const connection = await User.pool.getConnection();
    console.log("✅ MySQL connection pool is ready");
    connection.release();
  } catch (error) {
    console.error("❌ Database pool error:", error.message);
  }
});
