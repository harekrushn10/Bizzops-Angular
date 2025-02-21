import mongoose,{Schema} from "mongoose";

const customerSchema = new mongoose.Schema({
  owner: {
    type : Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

export const Customer = mongoose.model('Customer',customerSchema)