import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const baleSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  baleType: {
    type: String,
    enum: ['cotton', 'jute', 'wool'],
    default: 'cotton',
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'sale'],
    default: 'purchase',
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Bale = model('Bale', baleSchema);
export default Bale;
