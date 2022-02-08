import mongoose from "mongoose";

const serviceModel = mongoose.model("Service", {
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  seats: {
    type: Number,
    required: true,
    trim: true,
    min: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Must be a postive number");
      }
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default serviceModel;
