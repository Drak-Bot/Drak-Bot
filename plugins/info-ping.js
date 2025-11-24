module.exports = {
    name: 'ping',
    description: 'Mostra Ping, Uptime e Status del bot',
    async run(sock, msg, args) {
        try {
            const from = msg.key.remoteJid;

            // Calcola il ping
            const start = Date.now();
            const latency = Date.now() - start;

            // Tempo online
            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = Math.floor(uptimeSeconds % 60);
            const uptime = `${hours}h ${minutes}m ${seconds}s`;

            // Status del bot
            const status = 'Online'; // puoi cambiare se vuoi dinamico

            // Messaggio
            const text = `
🏓 Ping: ${latency}ms
⏱️ Uptime: ${uptime}
💻 Status: ${status}
            `;

            // Invia il messaggio
            await sock.sendMessage(from, { text });
        } catch (error) {
            console.error('Errore nel comando .ping:', error);
        }
    }
};
