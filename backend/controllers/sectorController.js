const Sector = require("../models/Sector");
const City = require("../models/City");
const Company = require("../models/Company");

// @desc    Get all sectors for a given city
// @route   GET /api/sectors/city/:cityId
// @access  Private
const getSectorsByCity = async (req, res, next) => {
  try {
    const city = await City.findOne({ _id: req.params.cityId, user: req.user._id });
    if (!city) {
      res.status(404);
      throw new Error("City not found");
    }

    const sectors = await Sector.find({ city: city._id, user: req.user._id }).sort({
      createdAt: 1,
    });
    res.json(sectors);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new sector inside a city
// @route   POST /api/sectors
// @access  Private
const createSector = async (req, res, next) => {
  try {
    const { name, cityId } = req.body;

    if (!name || !name.trim() || !cityId) {
      res.status(400);
      throw new Error("Sector name and cityId are required");
    }

    const city = await City.findOne({ _id: cityId, user: req.user._id });
    if (!city) {
      res.status(404);
      throw new Error("City not found");
    }

    const sector = await Sector.create({
      user: req.user._id,
      city: cityId,
      name: name.trim(),
    });

    res.status(201).json(sector);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a sector name
// @route   PUT /api/sectors/:id
// @access  Private
const updateSector = async (req, res, next) => {
  try {
    const sector = await Sector.findOne({ _id: req.params.id, user: req.user._id });

    if (!sector) {
      res.status(404);
      throw new Error("Sector not found");
    }

    sector.name = req.body.name?.trim() || sector.name;
    const updated = await sector.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a sector (and cascade delete its companies)
// @route   DELETE /api/sectors/:id
// @access  Private
const deleteSector = async (req, res, next) => {
  try {
    const sector = await Sector.findOne({ _id: req.params.id, user: req.user._id });

    if (!sector) {
      res.status(404);
      throw new Error("Sector not found");
    }

    await Company.deleteMany({ sector: sector._id, user: req.user._id });
    await sector.deleteOne();

    res.json({ message: "Sector and its companies deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSectorsByCity, createSector, updateSector, deleteSector };
