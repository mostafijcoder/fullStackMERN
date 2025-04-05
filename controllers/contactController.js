const Contact = require("../models/contact");

exports.saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send("All fields are required.");
    }

    await Contact.create({ name, email, message });
    console.log("✅ Contact saved:", { name, email, message });
    res.render("thanks", { title: "Thank You" });
    // or another page
  } catch (err) {
    console.error("❌ Error saving contact:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render("contactList", { contacts,title: "All contacts" });
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    res.status(500).send("Error loading contact list");
  }
};

exports.searchByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const contacts = await Contact.find({
      email: { $regex: new RegExp(email, "i") },
    });

    res.render("contactList", {
        contacts,
        title: "Search Results"
      });
      
  } catch (err) {
    console.error("❌ Error searching contacts:", err);
    res.status(500).send("Search error");
  }
};
