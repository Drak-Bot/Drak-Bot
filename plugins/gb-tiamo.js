// Plugin tiamo / ti amo senza prefisso (trigger ovunque nella frase)
let handler = async (m, { conn }) => {
  let msg = `𝐏𝐮𝐨𝐢 𝐚𝐦𝐚𝐫𝐞 𝐭𝐮𝐭𝐭𝐢 𝐭𝐫𝐚𝐧𝐧𝐞 𝐁𝐥𝐨𝐨𝐝, 𝐥𝐮𝐢 𝐚𝐩𝐩𝐚𝐫𝐭𝐢𝐞𝐧𝐞 𝐚 𝐕𝐞𝐥𝐢𝐭𝐡... 𝐬𝐩𝐚𝐫𝐢𝐬𝐜𝐢 😈 😈`
  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['tiamo', 'ti amo']
handler.tags = ['fun']

// Attiva appena NEL TESTO appare "tiamo" o "ti amo"
handler.customPrefix = /(tiamo|ti amo)/i
handler.command = new RegExp // obbligatorio per validare il plugin

export default handler
