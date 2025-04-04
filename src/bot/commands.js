const { InlineKeyboard } = require('telegraf');

const plans = [
  { id: 'monthly', name: 'Mensal', price: 99.90, days: 30 },
  { id: 'quarterly', name: 'Trimestral', price: 249.90, days: 90 },
  { id: 'yearly', name: 'Anual', price: 899.90, days: 365 }
];

function setupCommands(bot) {
  // Comando /start
  bot.start(async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text('📌 Assinar Plano', 'show_plans')
      .text('🔄 Renovar', 'renew_subscription')
      .row()
      .text('ℹ️ Minha Assinatura', 'check_status');
    
    await ctx.reply('Bem-vindo ao Bot de Pagamentos! Escolha uma opção:', {
      reply_markup: keyboard
    });
  });

  // Comando /admin (restrito)
  bot.command('admin', async (ctx) => {
    if (ctx.from.id !== parseInt(process.env.ADMIN_CHAT_ID)) {
      return ctx.reply('Acesso negado!');
    }
    
    // Lógica administrativa aqui
    await ctx.reply('Painel de Administração');
  });
}

module.exports = { setupCommands };