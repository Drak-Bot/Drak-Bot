//=============== PLUGIN .velith ===============//

module.exports = {
    name: "velith",
    alias: ["velith"],
    desc: "Velith frase",
    category: "fun",
    react: "💍",

    start: async (sock, m, { text }) => {

        const msg = `
*Velith é la moglie di Blood, intoccabile sotto tutti i punti di vista.  
Meglio per voi stare lontani perché Blood vi distrugge senza pietà.  
Occhio che se la toccate Blood non guarda in faccia nessuno.*`;

        await sock.sendMessage(m.from, { text: msg }, { quoted: m });
    }
};
