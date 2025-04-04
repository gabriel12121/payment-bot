const cron = require('node-cron');
const { Payment } = require('../database/models');

function startScheduler(bot) {
  // Verifica pagamentos pendentes a cada hora
  cron.schedule('0 * * * *', async () => {
    const pendingPayments = await Payment.find({
      status: 'pending',
      createdAt: { $lt: new Date(Date.now() - 23 * 60 * 60 * 1000) }
    });
    
    for (const payment of pendingPayments) {
      await bot.telegram.sendMessage(
        payment.userId,
        '⚠️ Seu pagamento expira em 1 hora! Finalize agora para garantir sua assinatura.'
      );
    }
  });

  // Verifica renovações (diariamente às 9h)
  cron.schedule('0 9 * * *', async () => {
    const expiringSubs = await Payment.find({
      active: true,
      expiresAt: { 
        $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        $gt: new Date()
      }
    });
    
    for (const sub of expiringSubs) {
      const daysLeft = Math.ceil((sub.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
      
      await bot.telegram.sendMessage(
        sub.userId,
        `🔔 Sua assinatura vence em ${daysLeft} dias. Renove agora para evitar interrupções!`
      );
    }
  });
}

module.exports = { startScheduler };