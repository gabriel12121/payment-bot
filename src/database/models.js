const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  userId: Number,
  amount: Number,
  plan: String,
  method: String,
  status: { type: String, default: 'pending' },
  expiresAt: Date,
  active: { type: Boolean, default: false }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

async function initDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('📦 Conectado ao MongoDB');
}

module.exports = { initDatabase, Payment };