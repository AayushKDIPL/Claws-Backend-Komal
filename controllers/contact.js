import Contact from "../models/contact.js";

const ContactController = {
  getContacts: async (req, res) => {
    try {
      const contacts = await Contact.find({});
      return res.status(201).json({ message: contacts });
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
  addContact: async (req, res) => {
    try {
      const { name, number, email, message } = req.body;

      if (!name || !number || !email || !message)
        throw new Error("name, number, email and message is required");

      await Contact.create({
        name,
        number,
        email,
        message,
      });

      return res.status(201).json({ message: "Contact created successfully" });
    } catch (error) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default ContactController;
