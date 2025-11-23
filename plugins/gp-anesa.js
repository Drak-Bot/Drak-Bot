// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `𝔸𝕟𝕖𝕩𝕒 𝕖 𝕦𝕟𝕒 𝕕𝕖𝕝𝕝𝕖 𝕡𝕠𝕔𝕙𝕖 𝕡𝕖𝕣𝕤𝕠𝕟𝕖 𝕡𝕚ù 𝕓𝕦𝕠𝕟𝕖, 𝕓𝕖𝕝𝕝𝕖, 𝕤𝕚𝕞𝕡𝕒𝕥𝕚𝕔𝕙𝕖 è 𝕔𝕒𝕣𝕚𝕟𝕖 𝕔𝕙𝕖 𝕔𝕚 𝕡𝕠𝕤𝕤𝕠𝕟𝕠 𝕖𝕤𝕤𝕖𝕣𝕖 𝕤𝕦𝕝𝕝𝕒 𝕥𝕖𝕣𝕣𝕒.
𝕆𝕧𝕧𝕚𝕒𝕞𝕖𝕟𝕥𝕖 𝕤𝕒𝕡𝕖𝕥𝕖 𝕘𝕚à 𝕔𝕙𝕖 𝕗𝕚𝕟𝕖 𝕗𝕒𝕣𝕖𝕥𝕖 𝕤𝕖 𝕡𝕣𝕠𝕧𝕒𝕥𝕖 𝕒 𝕥𝕠𝕔𝕔𝕒𝕣𝕝𝕒 𝕢𝕦𝕚𝕟𝕕𝕚 𝕟𝕠𝕟 𝕗𝕒𝕥𝕖𝕝𝕠 (𝕡𝕣𝕠𝕡𝕣𝕚𝕖𝕥à 𝕕𝕚 𝕯𝖊ⱥ𝖙𝖍)`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['anesa'];
handler.tags = ['fun'];
handler.command = /^anesa$/i;

export default handler;
