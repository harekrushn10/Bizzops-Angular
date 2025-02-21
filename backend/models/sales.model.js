import mongoose, { Schema } from 'mongoose';
import { Inventory } from './inventory.model.js';

const salesSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: { 
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    profitInPercent: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    sale:{
        type:Number,
        required: true
    },
    profit:{
        type:Number,
        required:true
    },
    cost:{
        type:Number,
        required:true
    }
}, { timestamps: true });

// Post-save hook to update the inventory after sale
salesSchema.post('save', async function (doc) {
    try {
        const inventoryItem = await Inventory.findById(doc.product);
        
        if (!inventoryItem) {
            throw new Error('Inventory item not found');
        }

        inventoryItem.stockRemain -= doc.qty;

        await inventoryItem.save();
    } catch (error) {
        console.error('Error updating inventory after sale:', error);
    }
});

export const Sales = mongoose.model('Sales', salesSchema);
