import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { Customer } from '../models/customer.models.js';

const addCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone, city } = req.body;
    const owner = req.user?._id;

    if (!name || !email || !phone || !city) {
        throw new ApiError(400, "All fields are required");
    }
    if (!owner) {
        throw new ApiError(400, "Unauthorized request");
    }

    const customer = await Customer.create({
        owner,
        name,
        email,
        phone,
        city
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { customer }, "Customer Added successfully"));
});

const getCustomer = asyncHandler(async (req, res) => {
    const owner = req.user?._id;
    if (!owner) {
        throw new ApiError(400, "Unauthorized request");
    }

    const customers = await Customer.find({ owner });
    if (!customers) {
        throw new ApiError(200, "No customer found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { customers }, "Customers retrieved successfully"));
});

// New function to count customers
const countCustomers = asyncHandler(async (req, res) => {
    const owner = req.user?._id;
    if (!owner) {
        throw new ApiError(400, "Unauthorized request");
    }

    const customerCount = await Customer.countDocuments({ owner });

    return res
        .status(200)
        .json(new ApiResponse(200, { count: customerCount }, "Customer count retrieved successfully"));
});

export {
    addCustomer,
    getCustomer,
    countCustomers 
};
