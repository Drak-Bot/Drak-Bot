const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const crypto = require("crypto");

const READINGS = [
    "La chimica è fortissima! ❤️",
    "Connessione dolce ma lenta… 💞",
    "Vi capite al volo 😍",
    "Potenziale buono, serve comunicazione 💬",
    "Amici speciali prima, amore poi… 💗",
    "Passione alta! 🔥",
    "Compatibilità incerta, fate piccoli passi 👣",
    "Siete complementari ✨",
    "Molto feeling, ma aspettative diverse 🔍",
    "Energia esplosiva! 💥"
];

// compatibilità deterministica
function compatibility(id1, id2) {
    const h = crypto.createHash("sha256")
        .update(id1 + ":" + id2)
        .digest("hex");
    return parseInt(h.substring(0, 8), 16) % 101;
}

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const chatId = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        // comando .sfera
        if (text && text.trim().toLowerCase() === ".sfera") {

            // deve essere gruppo
            if (!chatId.endsWith("@g.us")) {
                await sock.sendMessage(chatId, { text: "Questo comando funziona solo nei gruppi!" });
                return;
            }

            const group = await sock.groupMetadata(chatId);

            // lista membri escluso chi ha scritto
            const members = group.participants
                .map(m => m.id)
                .filter(id => id !== sender);

            if (members.length < 1) {
                await sock.sendMessage(chatId, { text: "Non ci sono abbastanza membri nel gruppo!" });
                return;
            }

            // persona casuale
            const chosen = members[Math.floor(Math.random() * members.length)];

            // calcolo compatibilità
            const percent = compatibility(sender, chosen);

            let reading;
            if (percent >= 90) reading = READINGS[0];
            else if (percent >= 75) reading = READINGS[2];
            else if (percent >= 60) reading = READINGS[4];
            else if (percent >= 45) reading = READINGS[6];
            else if (percent >= 30) reading = READINGS[7];
            else reading = READINGS[9];

            const bars =
                "❤".repeat(Math.floor(percent / 10)) +
                "♡".repeat(10 - Math.floor(percent / 10));

            const message =
                `🔮 *Sfera dell’Amore*\n\n` +
                `👤 *Tu:* @${sender.split("@")[0]}\n` +
                `🎯 *Persona estratta:* @${chosen.split("@")[0]}\n\n` +
                `❤️ *Compatibilità:* *${percent}%*\n${bars}\n\n` +
                `✨ ${reading}`;

            // TAG automatici
            await sock.sendMessage(chatId, {
                text: message,
                mentions: [sender, chosen]
            });
        }
    });
}

start();
