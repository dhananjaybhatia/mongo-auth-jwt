require("dotenv").config();

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection successful "))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define schemas
const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: { type: String },
  password: { type: String },
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: { type: String },
  password: { type: String },
  purchasedCourses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

const CourseSchema = new mongoose.Schema({
  // Schema definition here
  title: String,
  description: String,
  imageLink: String,
  price: Number,
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
};
