let handler = async (m, { conn }) => {
  const reply = `🎮 *NICKNAME PLAYSTATION DEI MIEI PADRONI* 🎮

🪽 *Death*:  Kite_muort007
👾 *Blood*:  ninomegic

❤️ Questi sono i nickname ufficiali della PlayStation!`;

  await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
};

handler.help = ['playnik'];
handler.tags = ['fun'];
handler.command = /^playnik$/i;

export default handler;
