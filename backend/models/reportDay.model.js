import mongoose,{Schema} from "mongoose";

const reportDaySchema = new mongoose.Schema({
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

export const ReportDay = mongoose.model('ReportDay',reportDaySchema)