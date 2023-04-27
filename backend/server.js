const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const app = express();
const connectDb = require("./utils/connectDb");

connectDb();

// routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const port = process.env.PORT || 7002;

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
