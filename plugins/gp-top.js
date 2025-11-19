// Plugin .top 10 — funziona con tutti i messaggi
let handler = async (m, { conn, command, isGroup }) => {
    if (!isGroup) return
    const chatId = m.chat
    const dbChat = global.db.data.chats[chatId] ||= {}
    dbChat.messageCount = dbChat.messageCount || {}

    const participants = (await conn.groupMetadata(chatId)).participants

    // Ordina e prendi i primi 10
    let ranking = Object.entries(dbChat.messageCount)
        .map(([jid, count]) => {
            let p = participants.find(u => u.id === jid)
            let name = p ? (p.notify || p.id) : jid
            return { jid, name, count }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

    if (ranking.length === 0) {
        return conn.sendMessage(chatId, { text: "Nessun messaggio registrato ancora." }, { quoted: m })
    }

    // Prepara il testo
    let text = "📊 *Top 10 membri per numero di messaggi:*\n\n"
    ranking.forEach((u, i) => {
        text += `*${i + 1}.* ${u.name} — ${u.count} messaggi\n`
    })

    await conn.sendMessage(chatId, { text }, { quoted: m })
}

// Comando .top
handler.command = /^top$/i
handler.group = true

// ✅ Middleware: intercetta tutti i messaggi e incrementa il contatore
handler.all = async (m) => {
    if (m.isBot) return
    if (!m.isGroup) return
    const chatId = m.chat
    const dbChat = global.db.data.chats[chatId] ||= {}
    dbChat.messageCount = dbChat.messageCount || {}
    dbChat.messageCount[m.sender] = (dbChat.messageCount[m.sender] || 0) + 1
}

export default handler
