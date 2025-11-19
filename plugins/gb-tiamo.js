// Plugin tiamo / ti amo senza prefisso (trigger ovunque nella frase)
let handler = async (m, { conn }) => {
  let msg = `Puoi amare tutti tranne Blood, lui appartiene a Velith... sparisci 😈`
  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['tiamo', 'ti amo']
handler.tags = ['fun']

// Attiva appena NEL TESTO appare "tiamo" o "ti amo"
handler.customPrefix = /(tiamo|ti amo)/i
handler.command = new RegExp // obbligatorio per validare il plugin

export default handler
