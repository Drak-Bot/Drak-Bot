//=============== PLUGIN .blood ===============//

module.exports = {
    name: "blood",
    alias: ["blood"],
    desc: "Blood frase",
    category: "fun",
    react: "🩸",

    start: async (sock, m, { text }) => {

        const msg = `
*Blood é il catanese più simpatico delle comm, il mio migliore amico e il marito di Velith.  
Non lo fate incazzare o vi saltano i numeri e partono i doxx dove vi prende pure i peli del culo.*`;

        await sock.sendMessage(m.from, { text: msg }, { quoted: m });
    }
};
