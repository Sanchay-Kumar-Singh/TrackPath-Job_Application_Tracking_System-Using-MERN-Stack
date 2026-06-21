const express = require("express");
const router = express.Router();
const {
  getSectorsByCity,
  createSector,
  updateSector,
  deleteSector,
} = require("../controllers/sectorController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/city/:cityId", getSectorsByCity);
router.post("/", createSector);
router.route("/:id").put(updateSector).delete(deleteSector);

module.exports = router;
