import { asyncHandler } from "../utils/asynchandler.js";
import {User}  from "../models/User.models.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Lead from "../models/Lead.js";
// import { OTP } from "../models/otp.models.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import jwt  from "jsonwebtoken";
// import twilio from 'twilio';

// ✅ Fetch all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      message: "All users fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};


const generateRefreshAccessToken = async(userId,res) => {
     
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        user.refreshToken= refreshToken;
        await user.save({validateBeforeSave:false})

        // return {accessToken,refreshToken}

        const option = {
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken", refreshToken,option)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser, accessToken, refreshToken
                }
                ,
                "user logged in successfully"
            )
        )
    } catch (error) {
        console.error("Token Generation Error:", error); // ✅ Log real error
        throw new ApiError(500, error.message || "Something wrong while generating access token");
    }
}


const registerUser = asyncHandler(async(req,res) =>{
    // Get user details from the fronnt end:
    // validation - non empty
    // check if user already exist - usetrname : mail
    //check fro images and check for avtar
    // upload them to cloudinary : avtar
    // create user object - to enter into db
    // remove password and refresh token from the response
    // check for user creatio
    //return response:
    
    const {username,password, email,phone,role} = req.body

    // if(fullname = ""){
    //    throw new ApiError(404,"full name is required")
    // }
    // Checking the validation of all the field:
    if([username,email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400,"this field need to correction")
    }
    const exitedUser =await User.findOne({
        $or:[{username},{email}]
    })
    if(exitedUser){
        throw new ApiError(409,"user already exist");
    }
//     const avatarPath = req.files?.avatar?.[0]?.path;
//     const coverImagePath = req.files?.coverImage?.[0]?.path;


//     if(!avatarPath){
//         throw new ApiError(404, "avtar required")
//     }
//    const avatar= await uploadOnCloudinary(avatarPath)
//    const coverImage = await uploadOnCloudinary(coverImagePath)
//    if(!avatar){
//     throw new ApiError(404, "avatar required")
//    }

   const user = await User.create({
      email,
      role,
    //   avatar:avatar.url,
    //   coverImage:coverImage.url,
      password,
      phone,
      username:username.toLowerCase()
   })
   await user.save(); 

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500,"error on the server side")
   }

   return res.status(201).json(
      new  ApiResponse(200,"user created successfully",{
         user:createdUser})
)})
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Validation
  if (!password || (!username && !email)) {
    throw new ApiError(400, "Username/email and password are required");
  }

  // Find user by username or email
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  // Role-based access check (optional, for login restrictions)
  if (user.role !== "admin") {
    console.log("Role:", user.role);
    // Example: only allow certain roles to log in via this route
    // throw new ApiError(403, "You are not allowed to login here");
  }

  // Generate tokens and send cookies
  return await generateRefreshAccessToken(user._id, res);
});

 const assignLead = asyncHandler(async (req, res) => {
  try {
    const { leadId } = req.params;
    const { userId } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { assignedTo: userId },
      { new: true }
    ).populate("assignedTo", "username email");

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


//  Get all leads of a specific user
 const getLeadsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const leads = await Lead.find({ assignedTo: id }).populate("assignedTo", "username email");
    
    if (!leads.length) {
      return res.status(404).json({ success: false, message: "No leads found for this user" });
    }

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export {registerUser,loginUser, generateRefreshAccessToken,assignLead,getAllUsers,getLeadsByUser};