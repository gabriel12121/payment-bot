const { InlineKeyboard } = require('telegraf');
const { plans } = require('./commands');
const { getUserSubscription } = require('../database/queries');

function setupHandlers(bot) {
  // Mostrar planos disponíveis
  bot.action('show_plans', async (ctx) => {
    const keyboard = new InlineKeyboard();
    
    plans.forEach(plan => {
      keyboard.text(
        `${plan.name} - R$ ${plan.price.toFixed(2)}`, 
        `select_plan:${plan.id}`
      ).row();
    });

    await ctx.editMessageText('Escolha seu plano:', {
      reply_markup: keyboard
    });
  });

  // Selecionar plano específico
  bot.action(/select_plan:(.+)/, async (ctx) => {
    const planId = ctx.match[1];
    const plan = plans.find(p => p.id === planId);
    
    try {
      const { id, qrCode, amount } = await ctx.createPixPayment(
        ctx.from,
        plan.price,
        `Assinatura ${plan.name}`
      );

      await ctx.replyWithPhoto(
        { source: Buffer.from(qrCode.split(',')[1], 'base64') },
        {
          caption: `💳 *Pagamento PIX* 💳\n\n` +
                   `Valor: R$ ${amount.toFixed(2)}\n` +
                   `ID: ${id}\n\n` +
                   `Escaneie o QR Code para pagar`,
          parse_mode: 'Markdown'
        }
      );
    } catch (error) {
      await ctx.reply('❌ Erro ao gerar pagamento. Tente novamente mais tarde.');
    }
  });

  // Verificar status
  bot.action('check_status', async (ctx) => {
    const subscription = await getUserSubscription(ctx.from.id);
    
    if (!subscription) {
      return ctx.reply('Você não possui assinatura ativa.');
    }
    
    await ctx.reply(
      `📅 Status: ${subscription.active ? 'Ativa' : 'Inativa'}\n` +
      `📌 Plano: ${subscription.plan}\n` +
      `💰 Valor: R$ ${subscription.amount.toFixed(2)}\n` +
      `⏳ Vencimento: ${subscription.expiresAt.toLocaleDateString()}`
    );
  });
}

module.exports = { setupHandlers };