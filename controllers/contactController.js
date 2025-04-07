const Contact = require("../models/contact");

exports.saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body; // Assuming these fields are in the request body
    if (!name || !email || !message) {
      return res.status(400).send("All fields are required.");
    }

    await Contact.create({ name, email, message }); // Save the contact to the database
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
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.render("contactList", { contacts,title: "All contacts" }); // Render the contact list
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    res.status(500).send("Error loading contact list");
  }
};

exports.searchByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const contacts = await Contact.find({
      email: { $regex: new RegExp(email, "i") },// Case insensitive search
    });
// Pass the contacts variable to the view
res.render('contactList', { contacts: contacts });
      
  } catch (err) {
    console.error("❌ Error searching contacts:", err);
    res.status(500).send("Search error");
  }
};
