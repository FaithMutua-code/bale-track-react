import Savings from "../models/SavingsModel.js";
import mongoose from "mongoose";

const handleError = (
  res,
  error,
  message = "An error occurred",
  status = 500
) => {
  console.error(error);
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

// Create Savings Entry
// Create Savings Entry - Modified to accept targets for all types
const createSavingsEntry = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { savingsAmount, savingsType, targetName, targetAmount, savingsDate } = req.body;
    const userId = req.user._id;

    // Basic validation (unchanged)
    if (!savingsType || savingsAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide savingsType and savingsAmount",
      });
    }

    if (typeof savingsAmount !== "number" || savingsAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Savings amount must be a positive number",
      });
    }

    // Remove target-specific validation since targets are allowed for all types
    // Only validate targetAmount if provided (for any type)
    if (targetAmount !== undefined) {
      if (typeof targetAmount !== "number" || targetAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Target amount must be a positive number",
        });
      }
    }

    const newSaving = await Savings.create({
      user: userId,
      savingsAmount,
      savingsType,
      targetName: targetName || null, // Save for all types
      targetAmount: targetAmount || null, // Save for all types
      savingsDate: savingsDate || new Date(),
    });

    res.status(201).json({ success: true, data: { savings: newSaving } });
  } catch (error) {
    handleError(res, error, "Failed to create savings entry");
  }
};

// Update Savings - Modified to handle targets for all types
const updateSaving = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { savingsAmount, savingsType, targetName, targetAmount, savingsDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleError(res, null, "Invalid Saving ID", 400);
    }

    const existingSaving = await Savings.findOne({ _id: id, user: userId });
    if (!existingSaving) {
      return handleError(res, null, "Saving not found or unauthorized", 404);
    }

    const updateFields = {};

    if (savingsType !== undefined) {
      updateFields.savingsType = savingsType;
    }

    if (savingsAmount !== undefined) {
      if (typeof savingsAmount !== "number" || savingsAmount <= 0) {
        return handleError(
          res,
          null,
          "Savings amount must be a positive number",
          400
        );
      }
      updateFields.savingsAmount = savingsAmount;
    }

    // Always allow targetName update for any type
    if (targetName !== undefined) {
      updateFields.targetName = targetName || null;
    }

    // Always allow targetAmount update for any type
    if (targetAmount !== undefined) {
      if (targetAmount !== null) {
        if (typeof targetAmount !== "number" || targetAmount <= 0) {
          return handleError(
            res,
            null,
            "Target amount must be a positive number",
            400
          );
        }
      }
      updateFields.targetAmount = targetAmount || null;
    }

    if (savingsDate !== undefined) updateFields.savingsDate = savingsDate;

    if (Object.keys(updateFields).length === 0) {
      return handleError(res, null, "No valid fields provided for update", 400);
    }

    const updatedSaving = await Savings.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: { savings: updatedSaving } });
  } catch (error) {
    handleError(res, error, "Failed to update saving");
  }
};

// Get all Savings with sorting and filtering
const getSavings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, sortBy, sortOrder = "desc" } = req.query;

    const query = { user: userId };
    if (type) query.savingsType = type;

    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const savings = await Savings.find(query)
      .sort(sortBy ? sortOptions : { createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: { savings } });
  } catch (error) {
    handleError(res, error, "Failed to fetch savings");
  }
};

const getSavingsStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Savings.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          personal: {
            $sum: {
              $cond: [{ $eq: ["$savingsType", "personal"] }, "$savingsAmount", 0],
            },
          },
          business: {
            $sum: {
              $cond: [{ $eq: ["$savingsType", "business"] }, "$savingsAmount", 0],
            },
          },
          target: {
            $sum: {
              $cond: [{ $eq: ["$savingsType", "target"] }, "$savingsAmount", 0],
            },
          },
          overall: { $sum: "$savingsAmount" },
        },
      },
    ]);

    const result = stats[0] || { personal: 0, business: 0, target: 0, overall: 0 };
    
    res.status(200).json({
      success: true,
      data: {
        personal: result.personal,
        business: result.business,
        totals: {
          target: result.target,
          overall: result.overall,
        },
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch savings statistics");
  }
};

// Get Savings by ID
const getSavingsById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleError(res, null, "Invalid savings ID", 400);
    }

    const saving = await Savings.findOne({ _id: id, user: userId }).lean();

    if (!saving) {
      return handleError(res, null, "Saving not found", 404);
    }

    res.status(200).json({ success: true, data: { saving } });
  } catch (error) {
    handleError(res, error, "Failed to fetch saving");
  }
};




// Delete Savings
const deleteSaving = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleError(res, null, "Invalid saving ID", 400);
    }

    const saving = await Savings.findOneAndDelete({ _id: id, user: userId });

    if (!saving) {
      return handleError(res, null, "Saving not found or unauthorized", 404);
    }

    res.status(200).json({
      success: true,
      message: "Saving deleted successfully",
      data: { id: saving._id },
    });
  } catch (error) {
    handleError(res, error, "Failed to delete saving");
  }
};

export {
  deleteSaving,
  createSavingsEntry,
  updateSaving,
  getSavings,
  getSavingsById,
  getSavingsStats,
};