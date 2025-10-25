import express from "express";
import { registerUser ,loginUser,assignLead,getAllUsers,getLeadsByUser} from "../controllers/userController.js";
const Useroute = express.Router();

// Route for registering user
Useroute.post("/register", registerUser);
Useroute.post("/assign-lead/:leadId", assignLead);
// Route for login user
Useroute.post("/login", loginUser);
Useroute.get("/", getAllUsers);
Useroute.get("/:id", getLeadsByUser);

export default Useroute;
