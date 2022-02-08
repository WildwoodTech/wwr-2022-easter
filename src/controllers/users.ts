import userModel from "../models/user";
import serviceModel from "../models/service";
import {
  sendSignUpEmail,
  sendUpdaterPin,
  sendUpdateEmail,
} from "../utils/mailer";
import db from "../database/db";
import genToken from "../utils/genToken";
import { ExpressHandler } from "../types";

// @desc    Get all users
// @route   GET /api/v3/users
// @access  Private
export const getUsers: ExpressHandler = async (req, res, next) => {
  try {
    const users = await userModel.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// @desc    Get single user
// @route   GET /api/v3/users/:id
// @access  Private
export const getUser: ExpressHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with id: ${req.params.id} not found!`,
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// @desc    Create new user
// @route   POST /api/v3/users
// @access  Public
export const createUser: ExpressHandler = async (req, res, next) => {
  const session = await db.startSession();
  session.startTransaction();
  try {
    // Generate random updater pin for users and check for uniqueness
    let generatedToken = 0;
    let notUnique = true;
    while (notUnique) {
      generatedToken = genToken();
      let found = await userModel.findOne({ updaterPin: generatedToken });
      if (!found) {
        notUnique = false;
      }
    }
    req.body.updaterPin = generatedToken;

    const user = await userModel.create([req.body], { session });

    const service = await serviceModel.findById(req.body.serviceId);
    service.seats = service.seats - req.body.seats;
    await service.save({ session });

    if (!service) {
      throw new Error();
    }

    await session.commitTransaction();
    session.endSession();
    req.io.emit("userUpdate");
    sendSignUpEmail(
      req.body.email,
      req.body.serviceDate,
      req.body.seats,
      req.body.updaterPin
    );
    res.status(200).json({ success: true, data: user, service });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getUserUpdaterPin: ExpressHandler = async (req, res, next) => {
  // req.body.email
  try {
    if (!req.body.email) {
      throw new Error("missing data");
    }
    // find user by their updater pin
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("user not found");
    }

    sendUpdaterPin(user.email, user.updaterPin);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update single user
// @route   POST /api/v3/users/updater/:pin
// @access  Private
export const updateUserSeatsByUpdaterPin: ExpressHandler = async (
  req,
  res,
  next
) => {
  const session = await db.startSession();
  session.startTransaction();

  try {
    if (!req.body.newServiceId || !req.body.updaterPin) {
      throw new Error("missing data");
    }

    // find user by their updater pin
    const user = await userModel.findOne({ updaterPin: req.body.updaterPin });
    if (!user) {
      throw new Error("user with that pin not found");
    }

    // find the service the user is 'currently' signed up for
    const oldService = await serviceModel.findById(user.serviceId);
    if (!oldService) {
      throw new Error();
    }

    if (oldService._id == req.body.newServiceId) {
      oldService.seats = oldService.seats + (user.seats - req.body.seats);
      await oldService.save({ session });
    } else {
      // find the new service the user wants to go to; just checked if 'same'
      const newService = await serviceModel.findById(req.body.newServiceId);
      if (!newService) {
        throw new Error();
      }

      oldService.seats += user.seats;
      await oldService.save({ session });

      newService.seats -= req.body.seats;
      await newService.save({ session });

      user.serviceDate = newService.date;
    }

    user.seats = req.body.seats;
    user.serviceId = req.body.newServiceId;
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    req.io.emit("userUpdate");
    sendUpdateEmail(
      user.email,
      user.serviceDate,
      req.body.seats,
      req.body.updaterPin
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Delete single user
// @route   DELETE /api/v3/users/:id
// @access  Private
export const deleteUser: ExpressHandler = async (req, res, next) => {
  const session = await db.startSession();
  session.startTransaction();

  try {
    const user = await userModel.findByIdAndDelete([req.params.id], {
      session,
    });
    if (!user) {
      throw new Error();
    }

    const service = await serviceModel.findById(user.serviceId);
    if (!service) {
      throw new Error();
    }

    service.seats = service.seats + user.seats;
    await service.save({ session });

    await session.commitTransaction();
    session.endSession();
    req.io.emit("userUpdate");
    res.status(200).json({ success: true, data: user, service });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error });
  }
};

export const deleteUserByUpdaterPin: ExpressHandler = async (
  req,
  res,
  next
) => {
  const session = await db.startSession();
  session.startTransaction();

  console.log(req.params.pin);

  try {
    const user = await userModel.findOneAndDelete(
      {
        updaterPin: req.params.pin,
      },
      { session }
    );
    if (!user) {
      throw new Error("user with that pin not found");
    }

    const service = await serviceModel.findById(user.serviceId);
    if (!service) {
      throw new Error();
    }

    service.seats = service.seats + user.seats;
    await service.save({ session });

    await session.commitTransaction();
    session.endSession();
    req.io.emit("userUpdate");
    res.status(200).json({ success: true, data: user, service });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/v3/users/stats
// @access  Private
export const getStatistics: ExpressHandler = async (req, res, next) => {
  let statsObject = { childrensStatistics: [] };
  try {
    // Get seat total
    // const seatTotal = await User.aggregate([
    //   { $group: { _id: '', total_seats: { $sum: '$seats' } } },
    //   { $project: { _id: 0, total_seats: 1 } },
    // ]);
    // statsObject.seatStatistics.push(seatTotal[0]);

    // Get children sign ups per service and category
    const services = await serviceModel.find();
    for (const service of services) {
      const data = await userModel.aggregate([
        { $match: { serviceId: `${service._id}` } },
        {
          $group: {
            _id: "",
            nursery: { $sum: "$nursery" },
            twoYears: { $sum: "$twoYears" },
            threeYears: { $sum: "$threeYears" },
            fourYears: { $sum: "$fourYears" },
            kindergarten: { $sum: "$kindergarten" },
            wildLife: { $sum: "$wildLife" },
          },
        },
        {
          $project: {
            _id: 0,
            nursery: 1,
            twoYears: 1,
            threeYears: 1,
            fourYears: 1,
            kindergarten: 1,
            wildLife: 1,
          },
        },
      ]);
      const serviceTime = service.date.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        month: "long",
        weekday: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      statsObject.childrensStatistics.push({
        service: serviceTime,
        signUps: data[0],
      });
    }

    res.status(200).json(statsObject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
