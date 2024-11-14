const router = require("express").Router();
const authRoute = require("./authRoute");
const bookingRoute = require("./bookingRoute");

router.use("/auth", authRoute);
router.use("/booking", bookingRoute);
module.exports = router;
