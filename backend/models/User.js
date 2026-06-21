const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    techStack: { type: String, default: "" }, // e.g. "React.js, Tailwind CSS, Node.js"
    description: { type: String, default: "" }, // bullet points, newline separated
    githubLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    // Basic info
    age: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "" }, // stored file path

    // Education
    qualification: { type: String, default: "" }, // e.g. "B.Tech in CSE"
    college: { type: String, default: "" },
    graduationYear: { type: String, default: "" }, // e.g. "2026" or "Nov 2022 - Jun 2026"
    cgpa: { type: String, default: "" },

    // Skills - structured by category, matching resume layout
    skillsLanguages: { type: String, default: "" },
    skillsFrontend: { type: String, default: "" },
    skillsBackend: { type: String, default: "" },
    skillsDatabases: { type: String, default: "" },
    skillsTools: { type: String, default: "" },
    skillsCore: { type: String, default: "" }, // DSA, OOP, DBMS, CN, OS, AI

    // Projects (editable list, intended for ~2 highlighted projects)
    projects: { type: [projectSchema], default: [] },

    // Profile links
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    leetcode: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    // Resume file (PDF) - stored file path + original name
    resumeFile: { type: String, default: "" },
    resumeFileName: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
