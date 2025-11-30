import scdl from 'soundcloud-downloader'; // L'import per SoundCloud

// --- HANDLER PRINCIPALE AGGIORNATO (SOUNDCLOUD) ---
const handler = async (m, { conn, args, usedPrefix }) => {

    if (!args[0]) {
        return m.reply(`❌ Inserisci l'URL di una traccia SoundCloud.\nEsempio: *${usedPrefix}coolmp3* https://soundcloud.com/user/track-name`);
    }

    const trackUrl = args[0];
    
    // Controlla se l'URL sembra essere di SoundCloud
    if (!trackUrl.includes('soundcloud.com')) {
        return m.reply(`❌ L'URL fornito non sembra essere una traccia SoundCloud.`);
    }

    m.react('🕒');

    let title = 'Traccia-SoundCloud'; 

    try {
        await conn.sendMessage(m.chat, { 
            text: `🎧 Richiesta download traccia SoundCloud per URL: ${trackUrl} (usando soundcloud-downloader)...` 
        }, { quoted: m });
        
        // 1. Ottieni lo stream audio da SoundCloud
        // *** RIGA MODIFICATA: Utilizziamo scdl.downloadTrack ***
        const audioStream = await scdl.downloadTrack(trackUrl); 

        // 2. Ottieni le informazioni per il nome del file
        try {
            const trackInfo = await scdl.getInfo(trackUrl);
            // Si può anche usare trackInfo.title, ma mantengo la tua pulizia
            title = trackInfo.title.replace(/[^a-zA-Z0-9 ]/g, ''); 
        } catch (infoError) {
            console.warn("Impossibile ottenere info traccia, usando titolo di default.");
        }


        // 3. Invio Audio (tramite Stream)
        await conn.sendMessage(m.chat, { 
            audio: { stream: audioStream }, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`
        }, { quoted: m });
        
        m.react('✅');
        await conn.reply(m.chat, `✅ *${title}* inviato! (SoundCloud download)`, m);

    } catch (error) {
        console.error("Errore nel plugin SoundCloud:", error);
        m.react('❌');
        // Rimuoviamo i motivi non pertinenti per l'errore tecnico
        m.reply(`⚠️ Download fallito. Errore: ${error.message}\nMotivi comuni: Traccia non accessibile o problemi di rete.`);
    }
};

handler.command = ['coolmp3'];
handler.tags = ['media'];
handler.help = ['.coolmp3 <soundcloud link>'];
export default handler;
