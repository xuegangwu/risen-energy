import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  items: [{
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    name: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['bank_transfer', 'wechat', 'alipay'] },
  paymentTime: { type: Date },
  paymentNo: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  deliveryAddress: { type: String },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  if (!this.orderNo) {
    this.orderNo = 'ES' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

export default mongoose.model('Order', orderSchema);
