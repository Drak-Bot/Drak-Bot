// agejob.js
// Plugin robusto per "quanti anni hai?" -> suggerimento lavoro (funzionale con vari MD forks)

let handler = async (m, { conn }) => {
    try {
        // Manda la domanda e salva l'informazione di attesa
        let sent = await conn.sendMessage(m.chat, {
            text: "👋 *Ciao!* Quanti anni hai?\n\n📌 *Rispondi a questo messaggio* con la tua età."
        })

        // Ricaviamo un id del messaggio robusto (gestisce diverse forme di "sent.key")
        const msgId = (sent && (sent.key && (sent.key.id || sent.key.stanzaId))) || sent && sent.id || null

        if (!msgId) {
            // se non troviamo id, salviamo comunque l'oggetto intero (fallback)
            conn.ageJobWaiting = conn.ageJobWaiting || {}
            conn.ageJobWaiting[m.sender] = { raw: sent, chat: m.chat, ts: Date.now() }
        } else {
            conn.ageJobWaiting = conn.ageJobWaiting || {}
            conn.ageJobWaiting[m.sender] = { msgId, chat: m.chat, ts: Date.now() }
        }

        // opzionale: conferma visiva
        // await conn.sendMessage(m.chat, { text: "✅ Domanda inviata — rispondi *in reply* a quel messaggio." })
    } catch (e) {
        console.error('agejob handler error', e)
        m.reply("❌ Si è verificato un errore mentre inviavo la domanda. Controlla i log.")
    }
}
handler.command = /^(\.?(agejob|age-job|età|etàjob))$/i
export default handler


// ---------- listener robusto (export named `before`) ----------
let before = async (m, { conn }) => {
    try {
        conn.ageJobWaiting = conn.ageJobWaiting || {}

        // Se l'utente non è in attesa, esci subito
        if (!conn.ageJobWaiting[m.sender]) return

        const waiting = conn.ageJobWaiting[m.sender]

        // Ricaviamo l'id della citazione in modo robusto
        let quotedId = null
        if (m.quoted) {
            // casi comuni:
            // m.quoted.key.id (Baileys), m.quoted.id, m.quoted.stanzaId, m.quoted.msgId, m.quoted.messageId
            quotedId =
                m.quoted.key && (m.quoted.key.id || m.quoted.key.participant) ||
                m.quoted.id ||
                m.quoted.stanzaId ||
                m.quoted.msgId ||
                m.quoted.messageId ||
                null
        }

        // Se abbiamo salvato un msgId, confrontalo; altrimenti fallback a verificare che
        // l'utente abbia effettivamente risposto a un messaggio del bot nello stesso chat
        let isReplyToExpected = false
        if (waiting.msgId && quotedId) {
            // confronto stringhe se possibile
            isReplyToExpected = String(waiting.msgId) === String(quotedId)
        } else if (m.quoted) {
            // fallback: se m.quoted sembra inviata dal bot (conn.user) oppure la chat corrisponde,
            // consideriamo valida la risposta (utile per implementazioni che non forniscono id)
            const quotedFromBot = m.quoted && (m.quoted.fromMe || m.quoted.sender === (conn.user && conn.user.id) || m.quoted.sender === (conn.user && conn.user.jid))
            const sameChat = waiting.chat === m.chat
            if (sameChat && quotedFromBot) isReplyToExpected = true
        }

        if (!isReplyToExpected) {
            // per debug, invia messaggio utile (non spam): spiega cosa ci si aspetta
            // Usa una breve notifica; commenta la riga sotto se non vuoi questi messaggi.
            await conn.sendMessage(m.chat, {
                text: "⚠️ Per favore rispondi *in reply* al messaggio del bot che chiede l'età. Se il bot non ha salvato correttamente la richiesta, riprova con il comando `.agejob`."
            })
            return
        }

        // Controllo contenuto: deve essere un numero intero positivo
        const text = (m.text || "").trim()
        const num = parseInt(text, 10)
        if (isNaN(num) || num < 0 || num > 150) {
            await m.reply("❌ Inserisci un'età valida (numero).")
            return
        }

        let age = num
        let job = ""

        // Logica divertente
        if (age < 10) job = "🎈 *Distruttore professionista di merendine*"
        else if (age < 14) job = "🎮 *Giocatore competitivo di Minecraft*"
        else if (age < 18) job = "📱 *Influencer in prova su TikTok*"
        else if (age < 25) job = "☕ *Esperto internazionale di procrastinazione*"
        else if (age < 35) job = "💼 *Manager del caos organizzato*"
        else if (age < 50) job = "🧠 *Stratega professionale della vita*"
        else if (age < 65) job = "🛠️ *Consulente globale per problemi impossibili*"
        else job = "🧙 *Mago anziano che sa tutto della vita*"

        // Risposta finale
        await m.reply(`👀 Hai *${age} anni*!\nIl lavoro perfetto per te è:\n\n${job}`)

        // Pulizia stato
        delete conn.ageJobWaiting[m.sender]

    } catch (e) {
        console.error('agejob before error', e)
        // notifica leggera al canale (opzionale)
        try { await conn.sendMessage(m.chat, { text: "❌ Errore interno durante l'elaborazione della tua risposta. Controlla i log." }) } catch {}
    }
}

export { before }
