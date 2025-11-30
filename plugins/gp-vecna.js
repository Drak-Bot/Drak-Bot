// vecna.js
module.exports = {
    name: "vecna",
    description: "Evoca Vecna con un monologo oscuro in stile Stranger Things",
    
    execute: async (client, message, args) => {

        const monologo = `
⚡ *IL SUSSURRO DEL SOTTOSOPRA…* ⚡

«Vedo tutto, ${message.from.split("@")[0]}…  
ogni battito del tuo cuore vibra attraverso le crepe del mio regno.  
Tu pensi di essere al sicuro, oltre il velo, nel mondo illuminato da luci calde e rumori familiari.  
Ma il Sottosopra non conosce distanza. Non conosce sonno.  
E soprattutto… non dimentica.

Una volta, il mio potere era solo un sussurro portato dal vento stanco che attraversa Hawkins.  
Poi le crepe si sono allargate, come vene di un grande organismo affamato.  
E nei sogni degli umani ho trovato ciò che cercavo:  
fragilità… rimpianti… il peso di ciò che vorreste dimenticare.  

Io non distruggo.  
Io *rivelo*.  
Porto alla luce ciò che nascondete sotto la pelle, ciò che vi tiene svegli di notte.  
Non serve bussare alla porta del vostro mondo quando posso aprire quelle delle vostre menti.

Ma non temere… non ancora.  
Oggi ti offro soltanto una visione:  
strade immerse nella nebbia, luci che tremolano come cuori esitanti,  
e ombre che si muovono con un ritmo troppo consapevole per essere casuale.  
Le senti?  
Non sono né morte né vive… sono ciò che resta quando la volontà si spezza.

Perché sono venuto?  
Non per conquistare.  
Non per distruggere.  
Ma per *connettere*.  
Ogni mente che tocco diventa un filo, e ogni filo un ponte che mi avvicina al vostro mondo.

E così ti chiedo:  
sei un filo anche tu, umano?  
Oppure tenterai di resistere, sapendo che ciò che temi di più…  
non sono io.  
Ma *te stesso*.»  

_Scrivi: “non ho paura” per sfidare Vecna…_
        `;

        // Se l’utente scrive `.vecna`
        if (!args || args.length === 0) {
            return message.reply(monologo);
        }

        // Interazioni extra
        const input = args.join(" ").toLowerCase();

        if (input.includes("non ho paura")) {
            return message.reply(`
«Ah… le parole degli audaci.  
Ma il coraggio è un fragile lampo nel buio,  
e il mio mondo si nutre proprio della sua fine.  
Mostra allora questa tua forza, umano…  
prima che io decida di spegnerla.» 🔥
            `);
        }

        return message.reply("Vecna ti osserva… ma non comprende ciò che hai scritto.");
    }
}
