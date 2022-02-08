const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  getUserUpdaterPin,
  updateUserSeatsByUpdaterPin,
  deleteUserByUpdaterPin,
  deleteUser,
  getStatistics,
} = require("../controllers/users");

// Middleware
const authentication = require("../middleware/authentication");
const statsAuthentication = require("../middleware/statsAuthentication");

const router = new express.Router();

router.route("/").get(authentication, getUsers).post(createUser);

router.route("/stats").post(statsAuthentication, getStatistics);

router
  .route("/:id")
  .get(authentication, getUser)
  .delete(authentication, deleteUser);

router.route("/requester").post(getUserUpdaterPin);
router.route("/updater").post(updateUserSeatsByUpdaterPin);
router.route("/deleter/:pin").delete(deleteUserByUpdaterPin);

module.exports = router;
