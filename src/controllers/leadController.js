import Lead from "../models/Lead.js";

// Create new lead
const logNewLead = (source, name) => {
  console.log(`🆕 New Lead Received from ${source}: ${name}`);
};

export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, lead });
     logNewLead("Website", lead.name);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const meta = async (req, res) => {
    try {
    const lead = await Lead.create({
      name: req.body.name || "Meta User",
      email: req.body.email || "meta@example.com",
      phone: req.body.phone || "9999999999",
      service: req.body.service || "Car Rental",
      source: "Meta",
      campaignName: req.body.campaignName || "Meta Car Ad",
    });
    logNewLead("meta", lead.name);
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const google = async (req, res) => {
    try {
    const lead = await Lead.create({
      name: req.body.name || "Google Lead",
      email: req.body.email || "googlelead@example.com",
      phone: req.body.phone || "8888888888",
      service: req.body.service || "Cab Booking",
      source: "Google",
      keyword: req.body.keyword || "best cab rental",
      campaignName: req.body.campaignName || "Google Cab Campaign",
    });
    logNewLead("google", lead.name);
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};