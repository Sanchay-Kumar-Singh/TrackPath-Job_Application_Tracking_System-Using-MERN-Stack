const Company = require("../models/Company");
const Sector = require("../models/Sector");

// @desc    Get all companies for a given sector
// @route   GET /api/companies/sector/:sectorId
// @access  Private
const getCompaniesBySector = async (req, res, next) => {
  try {
    const sector = await Sector.findOne({ _id: req.params.sectorId, user: req.user._id });
    if (!sector) {
      res.status(404);
      throw new Error("Sector not found");
    }

    const companies = await Company.find({ sector: sector._id, user: req.user._id }).sort({
      createdAt: 1,
    });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Get every company for the logged-in user (used for dashboard stats)
// @route   GET /api/companies
// @access  Private
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ user: req.user._id })
      .populate("city", "name")
      .populate("sector", "name")
      .sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new company entry
// @route   POST /api/companies
// @access  Private
const createCompany = async (req, res, next) => {
  try {
    const { companyName, type, applied, response, process, detail, cityId, sectorId } = req.body;

    if (!companyName || !companyName.trim() || !cityId || !sectorId) {
      res.status(400);
      throw new Error("Company name, cityId and sectorId are required");
    }

    const sector = await Sector.findOne({ _id: sectorId, city: cityId, user: req.user._id });
    if (!sector) {
      res.status(404);
      throw new Error("Sector not found for this city");
    }

    const company = await Company.create({
      user: req.user._id,
      city: cityId,
      sector: sectorId,
      companyName: companyName.trim(),
      type: type || "Walk-in",
      applied: applied || false,
      response: response || "Pending",
      process: process || "Not Started",
      detail: detail || "",
    });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a company entry (any field, including status toggles)
// @route   PUT /api/companies/:id
// @access  Private
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, user: req.user._id });

    if (!company) {
      res.status(404);
      throw new Error("Company entry not found");
    }

    const fields = ["companyName", "type", "applied", "response", "process", "detail"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    const updated = await company.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a company entry
// @route   DELETE /api/companies/:id
// @access  Private
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, user: req.user._id });

    if (!company) {
      res.status(404);
      throw new Error("Company entry not found");
    }

    await company.deleteOne();
    res.json({ message: "Company entry deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompaniesBySector,
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};
