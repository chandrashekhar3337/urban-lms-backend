
import express from 'express'
import { createLead, getLeads, meta,google } from "../controllers/leadController.js";
const router = express.Router();
// Dummy Meta Ads webhook simulation
router.post("/meta", meta);
// Dummy Google Ads API simulation
router.post("/google",google)
router.post("/website", createLead);
router.get("/", getLeads);

export default router;