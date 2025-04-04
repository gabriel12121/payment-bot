const { Payment } = require('./models');

async function savePayment(data) {
  const payment = new Payment({
    paymentId: data.paymentId,
    userId: data.userId,
    amount: data.amount,
    plan: data.plan,
    method: data.method,
    status: data.status,
    expiresAt: new Date(Date.now() + (data.days * 24 * 60 * 60 * 1000))
  });
  
  return payment.save();
}

async function updatePaymentStatus(paymentId, status) {
  const payment = await Payment.findOneAndUpdate(
    { paymentId },
    { status, active: status === 'approved' },
    { new: true }
  );
  
  return payment;
}

async function getUserSubscription(userId) {
  return Payment.findOne({ userId, active: true })
    .sort({ createdAt: -1 });
}

module.exports = {
  savePayment,
  updatePaymentStatus,
  getUserSubscription
};