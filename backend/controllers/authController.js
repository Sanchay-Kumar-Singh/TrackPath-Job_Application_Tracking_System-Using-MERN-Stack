const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email and password");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's full profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const fields = [
      "name",
      "age",
      "phone",
      "location",
      "bio",
      "qualification",
      "college",
      "graduationYear",
      "cgpa",
      "skillsLanguages",
      "skillsFrontend",
      "skillsBackend",
      "skillsDatabases",
      "skillsTools",
      "skillsCore",
      "linkedin",
      "github",
      "leetcode",
      "portfolio",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Projects array comes in as JSON string from multipart form, or plain array from JSON body
    if (req.body.projects !== undefined) {
      try {
        const parsed =
          typeof req.body.projects === "string" ? JSON.parse(req.body.projects) : req.body.projects;
        if (Array.isArray(parsed)) {
          user.projects = parsed.map((p) => ({
            title: p.title || "",
            techStack: p.techStack || "",
            description: p.description || "",
            githubLink: p.githubLink || "",
            liveLink: p.liveLink || "",
          }));
        }
      } catch (e) {
        res.status(400);
        throw new Error("Invalid projects data");
      }
    }

    // Allow email update with uniqueness check
    if (req.body.email && req.body.email !== user.email) {
      const existing = await User.findOne({ email: req.body.email });
      if (existing) {
        res.status(400);
        throw new Error("This email is already in use");
      }
      user.email = req.body.email;
    }

    // Allow password update
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload / replace profile photo
// @route   POST /api/auth/profile/photo
// @access  Private
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No photo file uploaded");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Remove old photo file if it exists
    if (user.profilePhoto) {
      const oldPath = path.join(__dirname, "..", user.profilePhoto);
      fs.unlink(oldPath, () => {});
    }

    user.profilePhoto = `/uploads/photos/${req.file.filename}`;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload / replace resume PDF
// @route   POST /api/auth/profile/resume
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No resume file uploaded");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Remove old resume file if it exists
    if (user.resumeFile) {
      const oldPath = path.join(__dirname, "..", user.resumeFile);
      fs.unlink(oldPath, () => {});
    }

    user.resumeFile = `/uploads/resumes/${req.file.filename}`;
    user.resumeFileName = req.file.originalname;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete current resume PDF
// @route   DELETE /api/auth/profile/resume
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.resumeFile) {
      const oldPath = path.join(__dirname, "..", user.resumeFile);
      fs.unlink(oldPath, () => {});
    }

    user.resumeFile = "";
    user.resumeFileName = "";
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadPhoto,
  uploadResume,
  deleteResume,
};
