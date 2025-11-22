// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `*Blood é il catanese più simpatico delle comm, il mio migliore amico e il marito di Velith.  
Non lo fate incazzare o vi saltano i numeri e partono i doxx dove vi prende pure i peli del culo.*`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['eden'];
handler.tags = ['fun'];
handler.command = /^eden$/i;

export default handler;
