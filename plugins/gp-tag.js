module.exports = (sock) => {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (!body.startsWith('.totag')) return;
        if (!from.endsWith('@g.us')) {
            await sock.sendMessage(from, { text: 'Questo comando funziona solo nei gruppi.' });
            return;
        }

        const text = body.slice(4).trim();
        if (!text) {
            await sock.sendMessage(from, { text: 'Devi inserire un messaggio dopo .totag' });
            return;
        }

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants.map(p => p.id);

            await sock.sendMessage(from, { text, mentions: participants });
            console.log(`📢 Comando .totag eseguito in ${metadata.subject}`);
        } catch (err) {
            console.error('❌ Errore nel comando .totag:', err);
            await sock.sendMessage(from, { text: 'Errore durante l\'invio del messaggio.' });
        }
    });
};
