// src/commands.js

const RADLINK_CACHE_PATH = path.join(__dirname, '..', 'config', 'radlink-cache.json');
// Assicurati che PermissionLevel sia accessibile in questo scope
const PermissionLevel = { 
    // ... i tuoi livelli di permesso, es. WHITELIST: 1 ...
    WHITELIST: 1 
}; 
// Se i tuoi livelli di permesso sono importati, rimuovi la riga sopra.

function createCommandRegistry(dependencies) {
  const {
    permissionService,
    sock, // Essenziale per inviare messaggi interattivi
    logger,
    contactCache,
    botLid,
    aiService,
    antilinkService,
    antispamService,
    antinukeService, // Essenziale per la logica di stato
    muteService,
    callManager,
    downloadMediaMessage,
    lastfmService,
    awareOnlineService
  } = dependencies;

  const commands = [
    // === COMANDO PRINCIPALE: ANTINUKE (Visualizza Bottoni) ===
    {
      name: 'antinuke',
      usage: 'antinuke',
      minLevel: PermissionLevel.WHITELIST, 
      description: 'Gestisce la protezione antinuke del gruppo tramite bottoni.',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us')) {
          return { text: 'Il comando antinuke funziona solo nei gruppi.' };
        }

        if (!antinukeService) {
          return { text: 'Il servizio antinuke non è disponibile.' };
        }
        
        // 1. Legge lo stato attuale
        const isEnabled = await antinukeService.isEnabled(remoteJid);
        const statusText = isEnabled ? '🟢 ATTIVO' : '🔴 DISATTIVO';
        
        // 2. Crea il messaggio con i bottoni (ID statici SENZA prefisso)
        const buttons = [
          { buttonId: 'antinuke_attiva', buttonText: { displayText: '🟢 Attiva Protezione' }, type: 1 },
          { buttonId: 'antinuke_disattiva', buttonText: { displayText: '🔴 Disattiva Protezione' }, type: 1 }
        ];

        const buttonMessage = {
          text: `🛡️ **Stato AntiNuke:** *${statusText}*\n\nUsa i bottoni qui sotto per cambiare lo stato di protezione del gruppo.`,
          footer: 'Bagley 2.0 AntiNuke Service',
          buttons: buttons,
          headerType: 1
        };

        // Invia il messaggio interattivo (tramite sock)
        await sock.sendMessage(remoteJid, buttonMessage, { quoted: context.message });
        
        // Non restituiamo un oggetto testuale perché abbiamo già inviato il messaggio interattivo
        return {}; 
      }
    },

    // === COMANDO: ANTINUKE_ATTIVA (Gestisce il click del bottone) ===
    {
      // NOME DEVE CORRISPONDERE ESATTAMENTE AL buttonId SENZA PREFISSO!
      name: 'antinuke_attiva',
      usage: 'antinuke_attiva',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Attiva la protezione antinuke (gestito da bottone).',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us') || !antinukeService) return {};

        await antinukeService.setState(remoteJid, true);
        
        return {
          text: '☢️ Antinuke attivato. Nessuno fa il figo.'
        };
      }
    },

    // === COMANDO: ANTINUKE_DISATTIVA (Gestisce il click del bottone) ===
    {
      // NOME DEVE CORRISPONDERE ESATTAMENTE AL buttonId SENZA PREFISSO!
      name: 'antinuke_disattiva',
      usage: 'antinuke_disattiva',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Disattiva la protezione antinuke (gestito da bottone).',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us') || !antinukeService) return {};
        
        await antinukeService.setState(remoteJid, false);

        return {
          text: '☢️ Antinuke disattivato. Diventerò possibilmente Oppenheimer.'
        };
      }
    },
    
    // === COMANDO DI ENFORCEMENT: STEAL (Non modificato) ===
    {
      name: 'steal',
      usage: 'steal',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Prende il controllo del gruppo in tre fasi...',
      handler: async (context) => {
        if (!context.remoteJid?.endsWith('@g.us')) {
          return { text: 'Il comando steal funziona solo nei gruppi.' };
        }

        if (antinukeService && (await antinukeService.isEnabled(context.remoteJid))) {
          // La logica di protezione funziona correttamente con il servizio di stato
          return { text: 'Questo gruppo è protetto dall\'antinuke. Steal non disponibile.' };
        }

        // ... logica di steal ...
        return {}; 
      }
    },
    
    // === COMANDO DI ENFORCEMENT: ABUSE (Non modificato) ===
    {
      name: 'abuse',
      usage: 'abuse',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Rimuove admin, ribattezza il gruppo e lo svuota prima di abbandonarlo.',
      handler: async (context) => {
        if (!context.remoteJid?.endsWith('@g.us')) {
          return { text: 'Il comando abuse funziona solo nei gruppi.' };
        }

        if (antinukeService && (await antinukeService.isEnabled(context.remoteJid))) {
          // La logica di protezione funziona correttamente con il servizio di stato
          return { text: 'Questo gruppo è protetto dall\'antinuke. Abuse non è consentito.' };
        }

        // ... logica di abuse ...
        return {}; 
      }
    },
    // ... altri comandi ...
  ];
  return new Map(commands.map(cmd => [cmd.name, cmd]));
}

module.exports = {
  createCommandRegistry
};
