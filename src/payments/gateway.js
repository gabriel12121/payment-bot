const mercadopago = require('mercadopago');
const qrcode = require('qrcode');
const { savePayment } = require('../database/queries');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

async function createPixPayment(user, amount, description) {
  const payment = {
    transaction_amount: amount,
    description,
    payment_method_id: 'pix',
    payer: {
      email: `${user.id}@paymentbot.com`,
      first_name: user.first_name || 'Cliente'
    }
  };

  try {
    const response = await mercadopago.payment.create(payment);
    const { id, status, point_of_interaction } = response.body;
    
    // Salva no banco de dados
    await savePayment({
      paymentId: id,
      userId: user.id,
      amount,
      status,
      method: 'pix'
    });

    // Gera QR Code
    const qrCode = await generateQR(point_of_interaction.transaction_data.qr_code);
    
    return { id, qrCode, amount };
  } catch (error) {
    console.error('Erro no gateway:', error);
    throw error;
  }
}

async function generateQR(data) {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(data, (err, url) => {
      if (err) reject(err);
      resolve(url);
    });
  });
}

module.exports = { setupPaymentGateway: (bot) => {
  bot.context.createPixPayment = createPixPayment;
}};