import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expenseType: {
    type: String,
    required: true,
    enum:  ["transport", "utilities", "salaries", "supplies", "other"],
    required: true,
    lowercase: true,
    trim: true,
  },

  expenseDescription: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: "",
  },

  expenseAmount: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },

},{
    timestamps:true
});


const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
