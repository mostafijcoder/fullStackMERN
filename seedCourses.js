const mongoose = require("mongoose");
const Course = require("./models/course");

const seedCourses = async () => {
  try {
    const courseCount = await Course.countDocuments();
    
    if (courseCount > 0) {
      console.log("Courses already exist. Skipping seeding.");
      return;
    }
    
    const courses = [
      {
        title: "Italian Pasta Making",
        description: "Learn how to make authentic Italian pasta.",
        items: ["Flour", "Eggs", "Olive Oil"],
        cost: 50,
        zipCodes: [10001, 10002, 10003],
      },
      {
        title: "Baking Basics",
        description: "Master the art of baking bread and cakes.",
        items: ["Flour", "Sugar", "Yeast"],
        cost: 25,
        zipCodes: [20001, 20002, 20003],
      },
      {
        title: "Vegan Cooking",
        description: "Cook delicious and nutritious vegan meals.",
        items: ["Tofu", "Vegetables", "Spices"],
        cost: 10,
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
