import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  items: [
    {
      itemName: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      tax: { type: Number, required: true }
    }
  ],
  paid: {
    type: Boolean,
    required: true,
    default: false
  },
  subTotal: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  date:{
    type:Date,
    required: true
  }
});

export const Invoice = mongoose.model('Invoice', invoiceSchema);