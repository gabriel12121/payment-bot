# 🤖 Telegram Payment Pro

**Solução completa para gestão financeira no Telegram**  
Bot automatizado para cobranças recorrentes, geração de PIX e gestão de assinaturas com painel administrativo integrado.



## ✨ Funcionalidades

| Feature          | Descrição                                                                 |
|------------------|--------------------------------------------------------------------------|
| 💸 Pagamentos    | Geração automática de QR Code PIX e links de pagamento                   |
| 🔄 Assinaturas   | Controle de ciclos (mensal/trimestral/anual) com renovação automática    |
| 📊 Relatórios    | Dashboard com métricas financeiras e CSV exportável                      |
| 🤖 Automações    | Lembretes personalizados e respostas inteligentes                        |

⚡ Como Usar

1. **Configuração Inicial**
```bash
git clone https://github.com/seu-usuario/telegram-payment-bot.git
cd telegram-payment-bot
npm install

Configurar variáveis de ambiente

TELEGRAM_TOKEN=seu_token_aqui
MONGODB_URI=mongodb://localhost:27017/payment-bot
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890123456

Iniciar o Bot
npm start

📌 Exemplo de Uso

// Criar novo pagamento
bot.command('pagamento', async (ctx) => {
  const payment = await createPayment(ctx.from.id, 99.90, 'Assinatura Mensal');
  await ctx.replyWithPhoto(payment.qrCode, {
    caption: `Pague R$ 99.90 via PIX\nID: ${payment.id}`
  });
});

🤝 Contribuição
Contribuições são bem-vindas! Siga estes passos:

Faça um Fork do projeto

Crie sua Branch (git checkout -b feature/AmazingFeature)

Commit suas Mudanças (git commit -m 'Add some AmazingFeature')

Push para a Branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.
