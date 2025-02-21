import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sales } from "../models/sales.model.js";
import { Inventory } from "../models/inventory.model.js";

const addSale = asyncHandler(async (req, res) => {
    const { product, price, profitInPercent, qty, date } = req.body;
    const owner = req.user?._id;

    if (!product || !price || !profitInPercent || !qty || !date) {
        throw new ApiError(400, "All fields are required");
    }

    const inventoryItem = await Inventory.findById(product);
    if (!inventoryItem) {
        throw new ApiError(404, "Product not found in inventory");
    }

    if (inventoryItem.stockRemain < qty) {
        throw new ApiError(400, "Not enough stock available");
    }

    const totalSale = (price * qty);
    const totalProfit = (totalSale * profitInPercent) / 100;
    const totalCost = totalSale - totalProfit;

    const newSale = await Sales.create({
        owner,
        product,
        productName: inventoryItem.item,
        price,
        profitInPercent,
        qty,
        sale: totalSale,
        profit: totalProfit,
        cost: totalCost,
        date: new Date(date)
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newSale, "Sale added successfully"));
});

const getSales = asyncHandler(async(req,res)=>{
    const { timeFilter } = req.params; 
    const ownerId = req.user?._id;

    let filter = { owner: ownerId }; 


    switch (timeFilter) {
        case 'oneday':
            const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1));
            filter.date = { $gte: oneDayAgo };
            break;
        case 'past30days':
            const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
            filter.date = { $gte: thirtyDaysAgo };
            break;
        case 'alltime':
        default:
            break;
    }

    const sales = await Sales.find(filter);
    return res
    .status(200)
    .json(new ApiResponse(200,sales,"sales get successfull"));
})

const getTotalSalesValueOneDay = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const result = await Sales.aggregate([
        { $match: { owner: ownerId, date: { $gte: startOfToday } } },
        { 
            $group: {
                _id: null,
                totalSalesValue: { $sum: "$sale" },
            },
        },
    ]);

    console.log(result)

    const totalSalesValue = result.length > 0 ? result[0].totalSalesValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalSalesValue }, "Total sales value for one day retrieved successfully"));
});

const getTotalSalesValueLast30Days = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    const result = await Sales.aggregate([
        { $match: { owner: ownerId, date: { $gte: thirtyDaysAgo } } },
        { 
            $group: {
                _id: null,
                totalSalesValue: { $sum: "$sale" }
            }
        }
    ]);

    const totalSalesValue = result.length > 0 ? result[0].totalSalesValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalSalesValue }, "Total sales value for past 30 days retrieved successfully"));
});

const getTotalSalesValueAllTime = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const result = await Sales.aggregate([
        { $match: { owner: ownerId } },
        { 
            $group: {
                _id: null,
                totalSalesValue: { $sum: "$sale" }
            }
        }
    ]);

    const totalSalesValue = result.length > 0 ? result[0].totalSalesValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalSalesValue }, "Total sales value for all time retrieved successfully"));
});

const getTotalProfitValueOneDay = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const result = await Sales.aggregate([
        { $match: { owner: ownerId, date: { $gte: startOfToday } } },
        { 
            $group: {
                _id: null,
                totalProfitValue: { $sum: "$profit" }, 
            },
        },
    ]);

    const totalProfitValue = result.length > 0 ? result[0].totalProfitValue : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { totalProfitValue }, "Total profit value for one day retrieved successfully"));
});

const getTotalProfitValueLast30Days = asyncHandler(async(req, res)=>{
    const ownerId = req.user?._id
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    
    const result = await Sales.aggregate([
        {$match:{owner:ownerId, date:{$gte:thirtyDaysAgo}}},
        {
            $group:{
                _id:null,
                totalProfitValue : {$sum:"$profit"}
            }
        }
    ])

    const totalProfitValue = result.length > 0 ? result[0].totalProfitValue : 0 

    return res
    .status(200)
    .json(new ApiResponse(200,{totalProfitValue},"Total profit value for last 30 days retrived successfull"))
})

const getTotalProfitValueAllTime = asyncHandler(async(req, res)=>{
    const ownerId = req.user?._id
    const result = await Sales.aggregate([
        {$match:{owner:ownerId}},
        {
            $group:{
                _id:null,
                totalProfitValue : {$sum:"$profit"}
            }
        }
    ])

    const totalProfitValue = result.length > 0 ? result[0].totalProfitValue : 0 

    return res
    .status(200)
    .json(new ApiResponse(200,{totalProfitValue},"Total profit  retrived successfull"))
})
const getTotalCostValueAllTime = asyncHandler(async(req, res)=>{
    const ownerId = req.user?._id
    const result = await Sales.aggregate([
        {$match:{owner:ownerId}},
        {
            $group:{
                _id:null,
                totalCostValue : {$sum:"$cost"}
            }
        }
    ])

    const totalCostValue = result.length > 0 ? result[0].totalCostValue : 0 

    return res
    .status(200)
    .json(new ApiResponse(200,{totalCostValue},"Total cost retrived successfull"))
})

const getDailyTotalSalesValuePast30Days = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    
    const results = await Sales.aggregate([
        { 
            $match: { 
                owner: ownerId, 
                date: { $gte: thirtyDaysAgo } 
            } 
        },
        { 
            $group: {
                _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$date" }
                },
                totalSalesValue: { $sum: "$sale" } 
            } 
        },
        {
            $sort: { _id: 1 } 
        }
    ]);

    const dailySalesValue = {};
    results.forEach(item => {
        dailySalesValue[item._id] = item.totalSalesValue;
    });
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        if (!dailySalesValue[formattedDate]) {
            dailySalesValue[formattedDate] = 0; 
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, dailySalesValue, "Daily total sales value for the past 30 days retrieved successfully"));
});

const getDailyProfitLast30Days = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;
    const today = new Date();
    const past30Days = new Date(today.setDate(today.getDate() - 30));

    const results = await Sales.aggregate([
        { 
            $match: { 
                owner: ownerId, 
                date: { $gte: past30Days } 
            } 
        },
        { 
            $group: {
                _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$date" } 
                },
                totalProfitValue: { $sum: "$profit" } 
            } 
        },
        {
            $sort: { _id: 1 } 
        }
    ]);

    const dailyProfitValue = {};
    results.forEach(item => {
        dailyProfitValue[item._id] = item.totalProfitValue;
    });

    const todayFormatted = today.toISOString().split('T')[0]; 
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        if (!dailyProfitValue[formattedDate]) {
            dailyProfitValue[formattedDate] = 0; 
        }
    }

    return res.status(200).json(new ApiResponse(200, dailyProfitValue, "Daily total profit value for the past 30 days retrieved successfully"));
});

const getDailyTotalCostValuePast30Days = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    
    const results = await Sales.aggregate([
        { 
            $match: { 
                owner: ownerId, 
                date: { $gte: thirtyDaysAgo } 
            } 
        },
        { 
            $group: {
                _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$date" } 
                },
                totalCostValue: { $sum: "$cost" } 
            } 
        },
        {
            $sort: { _id: 1 } 
        }
    ]);

    const dailyCostValue = {};
    results.forEach(item => {
        dailyCostValue[item._id] = item.totalCostValue;
    });

    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0]; 
        if (!dailyCostValue[formattedDate]) {
            dailyCostValue[formattedDate] = 0; 
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, dailyCostValue, "Daily total cost value for the past 30 days retrieved successfully"));
});



export { 
    addSale,
    getSales,
    getTotalSalesValueOneDay,
    getTotalSalesValueAllTime,
    getTotalSalesValueLast30Days,
    getTotalProfitValueOneDay,
    getTotalProfitValueLast30Days,
    getDailyTotalSalesValuePast30Days,
    getDailyProfitLast30Days,
    getDailyTotalCostValuePast30Days,
    getTotalProfitValueAllTime,
    getTotalCostValueAllTime
};