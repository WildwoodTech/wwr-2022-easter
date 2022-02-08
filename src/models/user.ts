import mongoose from "mongoose";
import validator from "validator";

// Custom casting; empty string to false
mongoose.Schema.Types.Boolean.convertToFalse.add("");

const userModel = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  serviceDate: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
    trim: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    validate(value) {
      if (value < 0 && value > 10) {
        throw new Error("Must be greater than 0 but less than 10");
      }
    },
  },
  updaterPin: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default userModel;
