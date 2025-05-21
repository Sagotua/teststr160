export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не дозволено' });
  }

  const { name, phone, city, warehouse, payment } = req.body;
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials missing' });
  }

  const message = `🛡 НОВЕ ЗАМОВЛЕННЯ:\n\n👤 Ім’я: ${name}\n📞 Телефон: ${phone}\n🏙 Місто: ${city}\n🏤 Відділення: ${warehouse}\n💳 Оплата: ${payment}`;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const data = await telegramRes.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: data });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
