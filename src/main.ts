import express from "express";
import http from "http";
import socketio from "socket.io";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import path from "path";
import errorHandler from "./middleware/error";
import ICustomRequest from "./types";

// Load env vars
dotenv.config();

// Connect to database
import "./database/db";

// Route files
const users = require("./routes/users");
const services = require("./routes/services");
// const admins = require('./routes/admins');

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

// Pass socket to req
app.use(async (req: ICustomRequest, res, next) => {
  req.io = io;
  next();
});

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Serve Static React
app.use(express.static(path.join(__dirname, "./frontend/build")));

// Mount routers
app.use("/api/v3/users", users);
app.use("/api/v3/services", services);
// app.use('/api/v3/admins', admins);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

// Custom error handler
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(
    chalk.green.underline.bold(`Server running in ${process.env.NODE_ENV} mode`)
  );
  console.log(
    chalk.yellow.underline.bold(`Server running on port ${process.env.PORT}`)
  );
});
