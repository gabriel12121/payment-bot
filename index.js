require('dotenv').config();
const { Telegraf } = require('telegraf');
const { setupCommands } = require('./src/bot/commands');
const { setupHandlers } = require('./src/bot/handlers');
const { setupPaymentGateway } = require('./src/payments/gateway');
const { initDatabase } = require('./src/database/models');
const { startScheduler } = require('./src/utils/scheduler');

async function main() {
  // Inicializa o banco de dados
  await initDatabase();

  // Cria a instância do bot
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  // Configurações
  setupPaymentGateway(bot);
  setupCommands(bot);
  setupHandlers(bot);
  
  // Agenda tarefas automáticas
  startScheduler(bot);

// Configura webhook para receber confirmações
bot.telegram.setWebhook(`https://seusite.com/webhook/${bot.secretPathComponent()}`);

// Rota para webhook (usando Express)
const express = require('express');
const app = express();
app.use(express.json());

app.post(`/webhook/mercadopago`, async (req, res) => {
  if (req.body.type === 'payment') {
    const paymentId = req.body.data.id;
    // Aqui você deve verificar o status real na API
    await updatePaymentStatus(paymentId, 'approved');
  }
  res.status(200).end();
});

app.listen(3000);

  // Inicia o bot
  bot.launch();
  console.log('🤖 Bot iniciado com sucesso!');
}

main().catch(console.error);