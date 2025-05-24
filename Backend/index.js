const express = require("express");
const rateLimit = require("express-rate-limit");

const database = require("./Configurations/database");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const tripRoutes = require("./routes/tripRoutes");
const busRoutes = require("./routes/busRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { setupBookingExpirationTask, setupBookingCompletionTask } = require('./util/ScheduledTaks');

const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP",
});

const cors = require("cors");

app.use(cors({
  origin: FRONTEND_URL,  // Allow frontend domain
  credentials: true      // Allow cookies to be sent
}));

app.options('*', cors());


// Start the scheduled task
//setupBookingExpirationTask();
//setupBookingCompletionTask();


app.use(express.json());
app.use(limiter);
app.use("/user", userRoutes);
app.use("/booking", bookingRoutes);
app.use("/payment", paymentRoutes);
app.use("/bus", busRoutes);
app.use("/trip", tripRoutes);
app.use("/review", reviewRoutes);
console.log("BACKEND SERVER STARTED");


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
