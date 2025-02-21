import mongoose,{Schema} from "mongoose";

const reportMonthSchema = new mongoose.Schema({
  expense: {
    type: Schema.Types.ObjectId,
    ref: 'Expense',
    required: true,
  },
  sales: {
    type: Schema.Types.ObjectId,
    ref: 'Sales',
    required: true,
  },
  profit:{
    type: Schema.Types.ObjectId,
    ref: 'Sales',
    required: true,
  }
});

export const ReportMonth = mongoose.model('ReportMonth',reportMonthSchema)


// import mongoose from 'mongoose';
// import { Sales } from './models/Sales';
// import { Expense } from './models/Expense';

// // Function to get totals for the past 30 days
// async function getTotalsForPast30Days() {
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(endDate.getDate() - 30);

//     // Aggregate total sales and profit
//     const salesTotals = await Sales.aggregate([
//         { $match: { date: { $gte: startDate, $lte: endDate } } },
//         {
//             $group: {
//                 _id: null,
//                 totalSales: { $sum: { $multiply: ["$Price", "$qty"] } },
//                 totalProfit: { $sum: { $multiply: ["$Price", "$qty", "$ProfitInPercent"] } / 100 }
//             }
//         }
//     ]);

//     // Aggregate total expenses
//     const expensesTotals = await Expense.aggregate([
//         { $match: { date: { $gte: startDate, $lte: endDate } } },
//         {
//             $group: {
//                 _id: null,
//                 totalExpenses: { $sum: "$expAmount" }
//             }
//         }
//     ]);

//     return {
//         totalSales: salesTotals[0]?.totalSales || 0,
//         totalProfit: salesTotals[0]?.totalProfit || 0,
//         totalExpenses: expensesTotals[0]?.totalExpenses || 0
//     };
// }

// // Function to get totals for a specific month
// async function getTotalsForMonth(year, month) {
//     const startDate = new Date(year, month, 1);
//     const endDate = new Date(year, month + 1, 0);

//     // Aggregate total sales and profit
//     const salesTotals = await Sales.aggregate([
//         { $match: { date: { $gte: startDate, $lte: endDate } } },
//         {
//             $group: {
//                 _id: null,
//                 totalSales: { $sum: { $multiply: ["$Price", "$qty"] } },
//                 totalProfit: { $sum: { $multiply: ["$Price", "$qty", "$ProfitInPercent"] } / 100 }
//             }
//         }
//     ]);

//     // Aggregate total expenses
//     const expensesTotals = await Expense.aggregate([
//         { $match: { date: { $gte: startDate, $lte: endDate } } },
//         {
//             $group: {
//                 _id: null,
//                 totalExpenses: { $sum: "$expAmount" }
//             }
//         }
//     ]);

//     return {
//         totalSales: salesTotals[0]?.totalSales || 0,
//         totalProfit: salesTotals[0]?.totalProfit || 0,
//         totalExpenses: expensesTotals[0]?.totalExpenses || 0
//     };
// }

// // Example usage
// (async () => {
//     const past30DaysTotals = await getTotalsForPast30Days();
//     console.log('Totals for the past 30 days:', past30DaysTotals);

//     const monthTotals = await getTotalsForMonth(2024, 8); // September 2024
//     console.log('Totals for September 2024:', monthTotals);
// })();

/*
import mongoose from 'mongoose';
import { Sales } from './models/Sales';
import { Expense } from './models/Expense';

// Function to get totals for today
async function getTotalsForToday() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Start of today

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today

    // Aggregate total sales and profit for today
    const salesTotals = await Sales.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: null,
                totalSales: { $sum: { $multiply: ["$Price", "$qty"] } },
                totalProfit: { $sum: { $multiply: ["$Price", "$qty", "$ProfitInPercent"] } / 100 }
            }
        }
    ]);

    // Aggregate total expenses for today
    const expensesTotals = await Expense.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: null,
                totalExpenses: { $sum: "$expAmount" }
            }
        }
    ]);

    return {
        totalSales: salesTotals[0]?.totalSales || 0,
        totalProfit: salesTotals[0]?.totalProfit || 0,
        totalExpenses: expensesTotals[0]?.totalExpenses || 0
    };
}

// Example usage
(async () => {
    const todayTotals = await getTotalsForToday();
    console.log('Totals for today:', todayTotals);
})();

*/