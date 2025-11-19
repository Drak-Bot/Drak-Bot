// Plugin .top 10 — classifica dei messaggi nel gruppo
let handler = async (m, { conn, command }) => {
  const chatId = m.chat
  const dbChat = global.db.data.chats[chatId] ||= {}
  dbChat.messageCount = dbChat.messageCount || {}  // { userId: count }

  const participants = (await conn.groupMetadata(chatId)).participants

  // ordina e prendi solo i primi 10
  let ranking = Object.entries(dbChat.messageCount)
    .map(([jid, count]) => {
      let p = participants.find(u => u.id === jid)
      let name = p ? (p.notify || p.id) : jid
      return { jid, name, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)  // top 10

  if (ranking.length === 0) {
    return conn.sendMessage(chatId, { text: "Nessun messaggio registrato ancora." }, { quoted: m })
  }

  // prepara il testo della classifica
  let text = "📊 *Top 10 membri per numero di messaggi:*\n\n"
  ranking.forEach((u, i) => {
    text += `*${i + 1}.* ${u.name} — ${u.count} messaggi\n`
  })

  await conn.sendMessage(chatId, { text }, { quoted: m })
}

handler.command = /^top$/i
handler.group = true

// —– Intercetta anche i messaggi per incrementare il contatore
let messageCounter = async (m, { isBot, isGroup, sender }) => {
  if (isBot) return
  if (!isGroup) return

  const chatId = m.chat
  const dbChat = global.db.data.chats[chatId] ||= {}
  dbChat.messageCount = dbChat.messageCount || {}
  dbChat.messageCount[sender] = (dbChat.messageCount[sender] || 0) + 1
}

export default { handler, messageCounter }
