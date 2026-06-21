const City = require("../models/City");
const Sector = require("../models/Sector");
const Company = require("../models/Company");

// @desc    Get all cities for logged-in user
// @route   GET /api/cities
// @access  Private
const getCities = async (req, res, next) => {
  try {
    const cities = await City.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(cities);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new city
// @route   POST /api/cities
// @access  Private
const createCity = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("City name is required");
    }

    const city = await City.create({ user: req.user._id, name: name.trim() });
    res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a city name
// @route   PUT /api/cities/:id
// @access  Private
const updateCity = async (req, res, next) => {
  try {
    const city = await City.findOne({ _id: req.params.id, user: req.user._id });

    if (!city) {
      res.status(404);
      throw new Error("City not found");
    }

    city.name = req.body.name?.trim() || city.name;
    const updated = await city.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a city (and cascade delete its sectors + companies)
// @route   DELETE /api/cities/:id
// @access  Private
const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findOne({ _id: req.params.id, user: req.user._id });

    if (!city) {
      res.status(404);
      throw new Error("City not found");
    }

    const sectors = await Sector.find({ city: city._id, user: req.user._id });
    const sectorIds = sectors.map((s) => s._id);

    await Company.deleteMany({ city: city._id, user: req.user._id });
    await Sector.deleteMany({ city: city._id, user: req.user._id });
    await city.deleteOne();

    res.json({ message: "City and all related data deleted", deletedSectors: sectorIds.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCities, createCity, updateCity, deleteCity };
