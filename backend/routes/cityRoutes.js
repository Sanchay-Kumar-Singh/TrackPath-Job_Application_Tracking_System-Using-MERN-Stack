const express = require("express");
const router = express.Router();
const { getCities, createCity, updateCity, deleteCity } = require("../controllers/cityController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getCities).post(createCity);
router.route("/:id").put(updateCity).delete(deleteCity);

module.exports = router;
