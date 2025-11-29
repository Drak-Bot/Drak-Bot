/**
 * Esegue la "Roulette Ban": seleziona casualmente un membro del gruppo e prepara il messaggio.
 * @param {Array<Object>} partecipanti - La lista dei partecipanti del gruppo (es. ottenuta da chat.participants).
 * @param {string} clientId - L'ID dell'utente/bot che esegue lo script.
 * @returns {{messaggio: string, utenteTaggato: string}} - L'output da inviare.
 */
function rouletteBan(partecipanti, clientId) {
    // 1. Filtra i partecipanti per escludere il bot
    const membriReali = partecipanti.filter(p => p.id._serialized !== clientId);

    if (membriReali.length === 0) {
        return { messaggio: "Non ci sono altri membri nel gruppo per eseguire la Roulette Ban.", utenteTaggato: "" };
    }

    // 2. Selezione casuale dell'indice
    const indiceCasuale = Math.floor(Math.random() * membriReali.length);
    
    // 3. Ottiene il membro selezionato
    const sfortunato = membriReali[indiceCasuale];
    
    // L'ID serializzato
    const utenteTaggato = sfortunato.id._serialized; 

    // 4. MESSAGGIO FISSO (Il secondo che hai scelto) 🎲
    const messaggioFisso = "🎲 La pallina gira, il tamburo spara... **Tutti zitti!** La sorte è stata lanciata. Il nostro prossimo candidato alla pausa chat è...";
    
    return { 
        // Viene aggiunto il tag all'utente
        messaggio: `${messaggioFisso} @${utenteTaggato.split('@')[0]}`,
        utenteTaggato: utenteTaggato
    };
}

module.exports = { rouletteBan }; 
