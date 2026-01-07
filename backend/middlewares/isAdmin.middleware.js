import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const isAdmin = asyncHandler(async (req, res, next) => {
    const adminRole = req.user.isAdmin;
    console.log(adminRole)
    if (!adminRole) {
        throw new ApiError(400, "Your are not the admin")
    }

    next()
})

export { isAdmin }