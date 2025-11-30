let handler = async (m, { conn }) => {
    // Step 1: il bot chiede l'età e salva che sta aspettando una risposta
    await conn.sendMessage(m.chat, {
        text: "👋 *Ciao! Quanti anni hai?*\n\nRispondi a *questo messaggio* con la tua età!"
    })

    // Salviamo in attesa una risposta per questo utente
    conn.ageJobWaiting = conn.ageJobWaiting || {}
    conn.ageJobWaiting[m.sender] = true
}

handler.command = /^agejob$/i
export default handler


// Listener per quando l’utente risponde
let before = async (m, { conn }) => {
    // Se non stiamo aspettando l’età, ignora
    conn.ageJobWaiting = conn.ageJobWaiting || {}
    if (!conn.ageJobWaiting[m.sender]) return

    // Controlliamo se ha risposto al messaggio del bot
    if (!m.quoted) return
    if (isNaN(m.text)) return m.reply("❌ Per favore scrivi solo un numero!")

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

    // Risposta del bot
    await m.reply(`👀 Hai *${age} anni*!\nIl lavoro perfetto per te è:\n\n${job}`)

    // Tolgo lo stato di attesa
    delete conn.ageJobWaiting[m.sender]
}

export { before }
