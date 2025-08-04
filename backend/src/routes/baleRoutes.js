import express from "express";
import { createBaleEntry ,getBaleById, getBales, deleteBale, updateBale} from "../controllers/baleController.js";
import {protect} from '../middleware/auth.js'

const baleRouter = express.Router();

baleRouter.post('/', protect,createBaleEntry);
baleRouter.get('/', protect ,getBales);
baleRouter.get('/:id', getBaleById);
baleRouter.patch('/:id', updateBale)
baleRouter.delete('/:id', deleteBale)
export default baleRouter;
