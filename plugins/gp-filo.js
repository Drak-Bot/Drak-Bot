// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `𝕝𝕒 𝕤𝕥𝕦𝕡𝕖𝕟𝕕𝕒 𝕗𝕚𝕝𝕠 𝕥𝕖𝕤𝕥𝕒 𝕕𝕚 𝕔𝕒𝕫𝕫𝕠 𝕤𝕚 𝕤𝕖𝕟𝕥𝕚𝕧𝕒 𝕔𝕠𝕟 𝕢𝕦𝕖𝕝 𝔻𝕠𝕞𝕖𝕟𝕚𝕔𝕠 𝕔𝕙𝕖 𝕠𝕣𝕒 𝕝𝕠 𝕤𝕔𝕙𝕚𝕗𝕒 𝕡𝕣𝕚𝕞𝕒 𝕝𝕠 𝕒𝕞𝕒𝕧𝕒 𝕡𝕖𝕟𝕤𝕒 𝕕𝕚 𝕖𝕤𝕤𝕖𝕣𝕖 𝕦𝕟𝕒 𝕕𝕦𝕣𝕒 𝕒 𝕗𝕦𝕞𝕒𝕣𝕖 𝕒 𝟙𝟛 𝕒𝕟𝕟𝕚 (𝕟𝕠𝕟 𝕝𝕠 è), 𝕕𝕚𝕔𝕖 𝕕𝕚 𝕖𝕤𝕤𝕖𝕣𝕖 𝕖𝕥𝕖𝕣𝕠 𝕞𝕒 𝕗𝕒 𝕝𝕖 𝕤𝕖𝕩𝕔𝕒𝕝𝕝 𝕔𝕠𝕟 𝕒𝕟𝕖𝕤𝕒`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['filo'];
handler.tags = ['fun'];
handler.command = /^filo|666$/i;

export default handler;
