import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/apierror.js";

export const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) throw new ApiError(401, "Unauthorized: No token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user) throw new ApiError(401, "Unauthorized: User not found");

      // Role check
      if (roles.length && !roles.includes(user.role)) {
        throw new ApiError(403, "Forbidden: You don't have access");
      }

      req.user = user; // attach user to request
      next();
    } catch (err) {
      next(err);
    }
  };
};
