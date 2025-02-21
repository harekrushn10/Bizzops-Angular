import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Inventory } from "../models/inventory.model.js";

const addInventoryItem = asyncHandler(async(req,res)=>{
    const {item, category, stockRemain, date} = req.body
    const owner = req.user?._id;

    if (!item || !category || !stockRemain || !date) {
        throw new ApiError(400, "All fields are required");
    }
    if(!owner){
        throw new ApiError(400,"user not found")
    }

    const addedItem = await Inventory.create({
        owner,
        item,
        category,
        stockRemain,
        date: new Date(date)
    })

    return res
    .status(200)
    .json(new ApiResponse(200,addedItem,"item added to inventory succesfull"))
})

const getInventoryItem = asyncHandler(async (req, res) => {
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(400, "User not found");
    }

    const inventoryItems = await Inventory.find({ owner });

 
    if (!inventoryItems ) {
        throw new ApiError(404, "No inventory items found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, inventoryItems || 0, "Inventory items fetched successfully"));
});

const addStock = asyncHandler(async (req, res) => {
    let { product, newQty } = req.body;  // product is a id of product
    newQty = Number(newQty);
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(400, "User not found");
    }

    if (!product || !newQty || newQty <= 0) {
        throw new ApiError(400, "Invalid product ID or quantity");
    }

    const inventoryItem = await Inventory.findOne({ _id: product, owner });

    if (!inventoryItem) {
        throw new ApiError(404, "Inventory item not found or you do not own this item");
    }

    inventoryItem.stockRemain += newQty;

    await inventoryItem.save();

    return res
        .status(200)
        .json(new ApiResponse(200, inventoryItem, "Stock updated successfully"));
});

const removeStock = asyncHandler(async (req, res) => {
    let { product, newQty } = req.body;  // product is a id of product
    newQty = Number(newQty);
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(400, "User not found");
    }

    if (!product || !newQty || newQty <= 0) {
        throw new ApiError(400, "Invalid product ID or quantity");
    }

    const inventoryItem = await Inventory.findOne({ _id: product, owner });

    if (!inventoryItem) {
        throw new ApiError(404, "Inventory item not found or you do not own this item");
    }

    inventoryItem.stockRemain -= newQty;

    await inventoryItem.save();

    return res
        .status(200)
        .json(new ApiResponse(200, inventoryItem, "Stock updated successfully"));
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
    const { product } = req.body;  // product is the id of the inventory item
    const owner = req.user?._id;

    if (!owner) {
        throw new ApiError(400, "User not found");
    }

    if (!product) {
        throw new ApiError(400, "Product ID is required");
    }

    const inventoryItem = await Inventory.deleteOne({ _id: product, owner });

    // if (!inventoryItem) {
    //     throw new ApiError(404, "Inventory item not found or you do not own this item");
    // }

    // await inventoryItem.remove();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Inventory item deleted successfully"));
});



export {
    addInventoryItem,
    getInventoryItem,
    addStock,
    removeStock,
    deleteInventoryItem 
}