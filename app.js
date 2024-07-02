const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const appRoutes = require("./routes/routes");

const port = process.env.PORT || 3000;
const app = express();

app.set("trust proxy", true);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Apply rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// Middleware function to set a timeout for all requests
app.use((req, res, next) => {
  // Set a timeout of 1 minute (60,000 milliseconds)
  const timeout = 60000;

  // Set a timeout for the request
  const requestTimeout = setTimeout(() => {
    // If the request is still pending after the timeout, terminate it
    res.status(504).send("Request Timeout");
  }, timeout);

  // Call next() to proceed with the request handling
  next();

  // Clear the timeout if the request is completed before the timeout
  res.on("finish", () => {
    clearTimeout(requestTimeout);
  });
});

// other routes
app.use("/api/", appRoutes.apiRoutes);

// Middleware for handling non-existent routes
app.use((req, res, next) => {
  res.status(404).send({
    status: false,
    message: `API Endpoint ${req.path}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: false,
    message: "Internal Server Error",
  });
});

app.listen({ port }, async () => {
  console.log(`Server Up on http://localhost:${port}`);
});
