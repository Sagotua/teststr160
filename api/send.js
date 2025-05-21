export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не дозволено' });
  }
  const { name, phone, city, warehouse, payment } = req.body;
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ error: 'Немає токена або чату' });
  }
  const message = `🛡 НОВЕ ЗАМОВЛЕННЯ:\n\n👤 Ім’я: ${name}\n📞 Телефон: ${phone}\n🏙 Місто: ${city}\n🏤 Відділення: ${warehouse}\n💳 Оплата: ${payment}`;
  const telegramURL = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const tgRes = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    const data = await tgRes.json();
    if (data.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: 'Telegram error', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Fetch error', details: err.message });
  }
}