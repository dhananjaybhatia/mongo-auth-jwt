require("dotenv").config();
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  try {
    const { username, password } = req.body;

    const newUser = await User.create({
      username: username,
      password: password,
    });
    res.status(200).json({
      user: newUser,
      msg: "User successfully created!!",
    });
  } catch (err) {
    res.status(400).json({
      msg: "Failed to create new User",
      err: err.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET);

      res.json({ token });
    } else {
      res.status(400).json({
        msg: "Incorrect Email and Password",
      });
    }
  } catch (err) {
    res.status(400).json({
      msg: "Incorrect input",
      err: err.message,
    });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const courses = await Course.find({});
  res.json({
    msg: "All courses",
    courses: courses,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const { courseId } = req.params;
  // Extract the username from the request headers (assuming userMiddleware has authenticated the user)
  const username = req.username;
  await User.findOneAndUpdate(
    {
      username: username,
    },
    {
      $push: { purchasedCourses: courseId },
    }
  );
  res.json({
    msg: "Purchase Complete",
  });
});


router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  try {
    // Extract username from userMiddleware
    const username = req.username;

    if (!username) {
      return res.status(401).json({ msg: "Unauthorized: Username not found" });
    }

    // Find the user
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch purchased courses
    const courses = await Course.find({
      _id: { $in: user.purchasedCourses },
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ msg: "No purchased courses found" });
    }

    // Respond with the courses
    res.json({ courses });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
