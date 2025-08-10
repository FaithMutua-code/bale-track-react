import Expense from "../models/ExpenseModel.js";
import mongoose from "mongoose";

// Helper function for error handling
const handleError = (res, error, message = "An error occurred") => {
  console.error(error);
  res.status(500).json({
    status: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

// Create a new entry
// route POST /api/expense
// @access Private
const createExpenseEntry = async (req, res) => {
  try {
    // debug
    //console.log("ReqUser", req.user);

    const { expenseType, expenseDescription, expenseAmount } = req.body;
    const userId = req.user._id;

    // validate the required fields
    if (!expenseType || !expenseDescription || !expenseAmount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (expenseAmount < 0) {  // Fixed: Changed 'amount' to 'expenseAmount'
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const newExpense = await Expense.create({
      user: userId,
      expenseType,
      expenseAmount,
      expenseDescription: expenseDescription || "",  // Fixed: Changed 'description' to 'expenseDescription'
    });

    res.status(201).json({
      success: true,
      data: {
        expense: newExpense,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to create expense entry");
  }
};

// Query the Expenses
// Desc: Get all expenses for the logged in user
// route GET /api/expenses
// access private only logged in user
const getExpense = async (req, res) => {  // Fixed: Changed function name to match export (or fix the export)
  try {
    const userId = req.user._id;
    //console.log("Fetching expenses for user:", userId);

    const expenses = await Expense.find({ user: userId });
    //console.log("Found expenses:", expenses);

    res.status(200).json({
      success: true,
      data: { expenses },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch expenses");
  }
};

// Get expense by id
// route GET /api/expense/:id
// @access Private
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid expense ID",  // Fixed: Changed from "bale ID" to "expense ID"
      });
    }

    const expense = await Expense.findOne({
      _id: id,
      user: userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        expense,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch expense");
  }
};

// @desc    Update an expense by ID
// @route   PATCH /api/expense/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { expenseType, expenseDescription, expenseAmount } = req.body;

    //console.log("Update req received", { id, userId, body: req.body });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid expense ID provided", id);
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    // Create update object with provided fields
    const updateFields = {};

    if (expenseType !== undefined) updateFields.expenseType = expenseType;

    // Amount check
    if (expenseAmount !== undefined) {
      if (expenseAmount < 0) {  // Fixed: Changed 'amount' to 'expenseAmount'
        return res.status(400).json({
          success: false,
          message: "Amount cannot be negative",
        });
      }
      updateFields.expenseAmount = expenseAmount;
    }
    
    // Description
    if (expenseDescription !== undefined) updateFields.expenseDescription = expenseDescription;

    console.log("Updating with fields:", updateFields);

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      console.log("Expense not found or unauthorized", { id, userId });
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to update it",
      });
    }

    console.log("Successfully updated");
    res.status(200).json({
      success: true,
      data: {
        expense: updatedExpense,  // Fixed: Added property name 'expense'
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to update expense");
  }
};

// @desc    Delete an expense by ID
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to delete it",
      });
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    handleError(res, error, "Failed to delete expense");
  }
};

export { 
  createExpenseEntry, 
  deleteExpense, 
  updateExpense, 
  getExpense,
  getExpenseById 
};