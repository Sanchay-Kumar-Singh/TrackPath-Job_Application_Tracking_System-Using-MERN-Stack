const express = require("express");
const router = express.Router();
const {
  getCompaniesBySector,
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getAllCompanies);
router.get("/sector/:sectorId", getCompaniesBySector);
router.post("/", createCompany);
router.route("/:id").put(updateCompany).delete(deleteCompany);

module.exports = router;
