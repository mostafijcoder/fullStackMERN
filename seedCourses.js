const mongoose = require("mongoose");
const Course = require("./models/course");



const seedCourses = async () => {
  try {
    await Course.deleteMany({}); // Clears existing courses

    const courses = [
      {
        title: "Italian Pasta Making",
        description: "Learn how to make authentic Italian pasta.",
        items: ["Flour", "Eggs", "Olive Oil"],
        zipCodes: [10001, 10002, 10003],
      },
      {
        title: "Baking Basics",
        description: "Master the art of baking bread and cakes.",
        items: ["Flour", "Sugar", "Yeast"],
        zipCodes: [20001, 20002, 20003],
      },
      {
        title: "Vegan Cooking",
        description: "Cook delicious and nutritious vegan meals.",
        items: ["Tofu", "Vegetables", "Spices"],
        zipCodes: [30001, 30002, 30003],
      }
    ];

    await Course.insertMany(courses);
    console.log("✅ Courses seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding courses:", err);
  } 
};

module.exports = seedCourses;
