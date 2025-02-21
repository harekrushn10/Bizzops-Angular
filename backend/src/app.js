import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 
app.use(cookieParser());

import userRouter from "../routes/user.routes.js";
import inventoryRouter from "../routes/inventory.routes.js";
import salesRouter from "../routes/sales.routes.js";
import customerRouter from "../routes/customer.routes.js";
import invoiceRouter from "../routes/invoice.routes.js";
import staffRouter from '../routes/staff.routes.js';
import expenseRouter from "../routes/expense.routes.js";
import notesRouter from "../routes/notes.routes.js";
import ordersRouter from "../routes/orders.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/sales", salesRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/notes", notesRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Something went wrong!' 
    });
});

export { app };
