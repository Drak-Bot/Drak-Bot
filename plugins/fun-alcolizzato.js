let handler = async (m, { conn, command, text }) => {
    // Genera un livello casuale di alcol nel sangue
    let width = Math.floor(Math.random() * 101);

    // Determina il messaggio in base al livello
    let finalPhrase = width >= 70 
        ? "🍾 𝐀𝐦𝐢𝐜𝐨 𝐬𝐞 𝐧𝐞 𝐯𝐮𝐨𝐢 𝐩𝐚𝐫𝐥𝐚𝐫𝐞 𝐜𝐢 𝐬𝐨𝐧𝐨..." 
        : width >= 30 
        ? "🥂 𝐁𝐞𝐯𝐞 𝐢𝐧 𝐦𝐨𝐝𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐚𝐛𝐢𝐥𝐞, 𝐨 𝐪𝐮𝐬𝐢..." 
        : "🚰 𝐍𝐨𝐧 𝐛𝐞𝐯𝐞 𝐦𝐚𝐢 𝐬𝐭𝐨 𝐧𝐞𝐠𝐫𝐨";

    // Creazione del messaggio
    let message = `
『💬』 ══ •⊰✰⊱• ══ 『💬』

MOMENTO DEL TEST DELL'ALCOL! 🍷 
━━━━━━━━━━━━━━
 ${text ? text : 'Tu'} ha un tasso alcolemico del ${width}%! 🍷
『💬』 ══ •⊰✰⊱• ══ 『💬』

${finalPhrase}
`.trim();

    const messageOptions = {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '',
                serverMessageId: '',
                newsletterName: `ChatUnity` // Utilizzo della variabile botName
            },
        }
    };

    // Invia il messaggio con le menzioni e le opzioni
    m.reply(message, null, { mentions: conn.parseMention(message), ...messageOptions });
};

handler.command = /^(alcolizzato|alcol)$/i;

export default handler;
