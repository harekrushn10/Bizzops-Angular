import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    expAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Expense = mongoose.model('Expense', expenseSchema);
