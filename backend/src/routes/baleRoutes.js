import express from "express";
import { createBaleEntry ,getBaleById, getBales, deleteBale, updateBale} from "../controllers/baleController.js";
import {protect} from '../middleware/auth.js'

const baleRouter = express.Router();

baleRouter.post('/', protect,createBaleEntry);
baleRouter.get('/', protect ,getBales);
baleRouter.get('/:id',protect, getBaleById);
baleRouter.patch('/:id',protect, updateBale)
baleRouter.delete('/:id', protect,deleteBale)
export default baleRouter;
