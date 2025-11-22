module.exports = (sock) => {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;

        // Prende testo da qualsiasi tipo di messaggio
        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            msg.message.videoMessage?.caption ||
            '';

        // Comandi supportati
        const commands = ['.tag', '.totag'];

        const usedCmd = commands.find(cmd => body.startsWith(cmd));
        if (!usedCmd) return;

        // Solo nei gruppi
        if (!from.endsWith('@g.us')) {
            await sock.sendMessage(from, { text: '❌ Questo comando funziona solo nei gruppi.' });
            return;
        }

        // Testo dopo il comando
        const text = body.slice(usedCmd.length).trim();
        if (!text) {
            await sock.sendMessage(from, { text: `⚠️ Devi inserire un messaggio dopo ${usedCmd}` });
            return;
        }

        try {
            // Ottieni membri
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants.map(p => p.id);

            // Invia messaggio con tag
            await sock.sendMessage(from, {
                text,
                mentions: participants
            });

            console.log(`📢 Comando ${usedCmd} eseguito in ${metadata.subject}`);
        } catch (err) {
            console.error(`❌ Errore nel comando ${usedCmd}:`, err);
            await sock.sendMessage(from, { text: '❌ Errore nell\'invio del messaggio.' });
        }
    });
};
