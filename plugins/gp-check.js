import os from 'os'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let target

    // ——————————————————————————————
    // 1️⃣ Se rispondi a un messaggio
    // ——————————————————————————————
    if (m.quoted) {
        target = m.quoted.sender
    }

    // ——————————————————————————————
    // 2️⃣ Se menzioni un utente
    // ——————————————————————————————
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0]
    }

    // ——————————————————————————————
    // 3️⃣ Se nessun utente è selezionato
    // ——————————————————————————————
    if (!target) {
        return m.reply(`❌ *Devi menzionare un utente o rispondere a un messaggio*\n\nEsempi:\n${usedPrefix}check @utente\n${usedPrefix}check (in risposta)`);
    }

    // ——————————————————————————————
    // 4️⃣ Info dispositivo
    // ——————————————————————————————
    let info = conn.userAgent || "Sconosciuto"

    let device = "Sconosciuto"

    info = info.toLowerCase()

    if (info.includes("android")) device = "📱 Android"
    if (info.includes("iphone") || info.includes("ios")) device = "📱 iPhone"
    if (info.includes("windows")) device = "🖥️ Windows"
    if (info.includes("mac")) device = "💻 MacOS"

    // ——————————————————————————————
    // 5️⃣ Risposta finale
    // ——————————————————————————————
    m.reply(`🔍 *Analisi del dispositivo*\n\n👤 Utente: @${target.split('@')[0]}\n📱 Dispositivo: *${device}*\n\n⚡ *Check completato!*`, { mentions: [target] })
}

handler.help = ['check @user']
handler.tags = ['info']
handler.command = /^check$/i

export default handler
