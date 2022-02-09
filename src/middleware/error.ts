import { NextFunction, Response } from "express";
import ICustomRequest from "../types";
import ErrorResponse from "../utils/errorResponse";

const errorHandler = (
  err: any,
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  // console.log(err.stack);
  // console.log(err.name);
  // console.log(err.message);

  if (err.message === "user not found") {
    const message = `user not found`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name === "CastError") {
    // Mongoose bad ObjectID
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name == "ValidationError") {
    // Mongoose Validation Error
    const message = error.message;
    error = new ErrorResponse(message, 406);
  }

  // Mongoose Validation Error
  if (err._message == "Service validation failed") {
    const message = `Error!`;
    error = new ErrorResponse(message, 405);
  }

  // Mongoose Duplicate Error
  if (err.code === 11000) {
    const message = `Error`;
    error = new ErrorResponse(message, 409);
  }

  res.status(error.statusCode || 404).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
