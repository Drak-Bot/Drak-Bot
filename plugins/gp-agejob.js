let handler = async (m, { conn }) => {
    
    // Messaggio del bot
    let sent = await conn.sendMessage(m.chat, {
        text: "👋 *Ciao! Quanti anni hai?*\n\nRispondi a *questo messaggio* con la tua età!"
    })

    // Salviamo l'ID del messaggio a cui l’utente deve rispondere
    conn.ageJobWaiting = conn.ageJobWaiting || {}
    conn.ageJobWaiting[m.sender] = sent.key.id
}

handler.command = /^agejob$/i
export default handler



// ───── LISTENER DELLE RISPOSTE ─────
let before = async (m, { conn }) => {

    conn.ageJobWaiting = conn.ageJobWaiting || {}

    // Se non aspettiamo l’età da questo utente → esci
    if (!conn.ageJobWaiting[m.sender]) return

    // Verifica che il messaggio sia una risposta al messaggio del bot
    if (!m.quoted || m.quoted.id !== conn.ageJobWaiting[m.sender]) return

    // Controllo che il messaggio sia un numero
    if (isNaN(m.text)) {
        return m.reply("❌ Scrivi solo un numero, per favore!")
    }

    let age = parseInt(m.text)
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

    // Risposta
    await m.reply(`👀 Hai *${age} anni*!\nIl lavoro perfetto per te è:\n\n${job}`)

    // Cancello lo stato in attesa
    delete conn.ageJobWaiting[m.sender]
}

export { before }
