module.exports = {
    name: "chucknorris",
    description: "Battuta casuale su Chuck Norris",
    
    execute: async (client, message, args) => {
        const jokes = [
            "Chuck Norris non fa push-up. Lui spinge la Terra giù.",
            "Quando Chuck Norris entra in una stanza, la porta si apre da sola... per paura.",
            "Chuck Norris non legge i libri, li fissa fino a che non gli raccontano tutto.",
            "Chuck Norris ha una volta vinto una partita a scacchi con un solo movimento: il suo sguardo.",
            "Chuck Norris non ha mai dormito, ha solo aspettato che il tempo si fermasse.",
            "Chuck Norris può dividere per zero.",
            "Quando Chuck Norris fa una torta, la torta chiede il permesso prima di essere mangiata."
        ];

        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        
        message.reply(`💥 *Chuck Norris Fact:* \n${joke}`);
    }
}
