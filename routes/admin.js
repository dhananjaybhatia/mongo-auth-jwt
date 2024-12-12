require("dotenv").config();

const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");
const router = Router();
const jwt = require("jsonwebtoken");

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  try {
    const { username, password } = req.body;
    const newAdmin = await Admin.create({
      username: username,
      password: password,
    });
    res.status(200).json({
      msg: " Admin created successfully",
      admin: newAdmin,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Failed to create admin",
      err: err.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.body;

  const admin = await Admin.findOne({
    username: username,
    password: password,
  });

  if (admin) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({
      token,
    });
  } else {
    res.status(400).json({
      msg: " Incorrect Email and Password",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const { title, description, imageLink, price } = req.body;
  try {
    const newCourse = await Course.create({
      title: title,
      description: description,
      imageLink: imageLink,
      price: price,
    });
    res.status(200).json({
      msg: "Course created successfully",
      courseID: newCourse._id,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to create course",
      error: err.message,
    });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const courses = await Course.find({});
  res.status(200).json({
    msg: "success",
    courses: courses,
  });
});

module.exports = router;
