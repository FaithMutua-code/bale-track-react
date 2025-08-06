import Expense from "../models/ExpenseModel.js";

//Helper function for error handling
const handleError = (res, error, message = "An error occurred") => {
  console.error(error);
  res.status(500).json({
    status: false,
    message: message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};


//create a new  entry
//route POST /api/Expense
//@access Private

//Record a new Expense





//query the Expenses
//Desc :Get all bales for the logged in user,
//route Get /api/Expenses
//access private only logged in user
// Enhanced  controller to handle query parameters








// @desc    Update a Expense by ID
// @route   PATCH /api/expense/:id
// @access  Private







// @desc    Delete a Expense by ID
// @route   DELETE /api/expense/:id
// @access  Private