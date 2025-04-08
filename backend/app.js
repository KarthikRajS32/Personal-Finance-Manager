const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

//! Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/personal-finance-db")
  .then(() => console.log("✅ DB Connected"))
  .catch((e) => console.error("❌ DB Connection Error:", e));

//! Middlewares
app.use(cors());
app.use(express.json());

//! Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/transactions", transactionRouter); // ✅ Correct route

//! Error Handler Middleware
app.use(errorHandler);

//! Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
