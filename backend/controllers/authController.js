const jwt = require("jsonwebtoken");
const User = require("../models/User");
const imagekit = require("../config/imagekit");
const path = require("path");

/* ---------------- GENERATE JWT TOKEN ---------------- */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/* ---------------- REGISTER USER ---------------- */
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

    const user = await User.create({
      name,
      email,
      password,
    });

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

/* ---------------- LOGIN USER ---------------- */
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

/* ---------------- GET PROFILE ---------------- */
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

/* ---------------- UPDATE PROFILE ---------------- */
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

    // Handle Projects
    if (req.body.projects !== undefined) {
      try {
        const parsed =
          typeof req.body.projects === "string"
            ? JSON.parse(req.body.projects)
            : req.body.projects;

        if (Array.isArray(parsed)) {
          user.projects = parsed.map((p) => ({
            title: p.title || "",
            techStack: p.techStack || "",
            description: p.description || "",
            githubLink: p.githubLink || "",
            liveLink: p.liveLink || "",
          }));
        }
      } catch (error) {
        res.status(400);
        throw new Error("Invalid projects data");
      }
    }

    // Update email
    if (req.body.email && req.body.email !== user.email) {
      const existing = await User.findOne({
        email: req.body.email,
      });

      if (existing) {
        res.status(400);
        throw new Error("This email is already in use");
      }

      user.email = req.body.email;
    }

    // Update password
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/* ---------------- UPLOAD PROFILE PHOTO ---------------- */
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

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `photo-${req.user._id}-${Date.now()}${path.extname(
        req.file.originalname
      )}`,
      folder: "/trackpath/photos",
      useUniqueFileName: true,
    });

    user.profilePhoto = result.url;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/* ---------------- UPLOAD RESUME ---------------- */
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

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `resume-${req.user._id}-${Date.now()}.pdf`,
      folder: "/trackpath/resumes",
      useUniqueFileName: true,
    });

    user.resumeFile = result.url;
    user.resumeFileName = req.file.originalname;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/* ---------------- DELETE RESUME ---------------- */
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

    user.resumeFile = "";
    user.resumeFileName = "";

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/* ---------------- EXPORTS ---------------- */
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadPhoto,
  uploadResume,
  deleteResume,
};