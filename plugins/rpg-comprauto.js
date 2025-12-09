// Legge il messaggio
let msg = (message.body || "").toLowerCase();

// Lista auto con immagine e prezzo
const cars = [
    { name: "Sultan", img: "https://i.imgur.com/2L67zUY.png", price: 15000 },
    { name: "Elegy", img: "https://i.imgur.com/JhWmY8W.png", price: 18000 },
    { name: "Banshee", img: "https://i.imgur.com/Ae1nnCV.png", price: 22000 },
    { name: "Buffalo", img: "https://i.imgur.com/FfGgS74.png", price: 20000 },
    { name: "SuperGT", img: "https://i.imgur.com/NvQHF2A.png", price: 30000 }
];

// --- Comando per mostrare listino ---
if(msg === ".comprauto") {
    let text = "🚘 *Autosalone – Auto disponibili:*\n\n";
    cars.forEach((car, index) => {
        text += `${index + 1}) *${car.name}* – $${car.price}\n`;
    });
    text += `\nPer acquistare scrivi: .comprauto <numero>`;
    
    sendMessage({
        chatId: message.from,
        text: text
    });
    return;
}

// --- Comando per acquistare auto ---
if(msg.startsWith(".comprauto ")) {
    let args = msg.split(" ");
    let num = parseInt(args[1]);

    if(isNaN(num) || num < 1 || num > cars.length) {
        sendMessage({
            chatId: message.from,
            text: "❌ Numero auto non valido."
        });
        return;
    }

    let car = cars[num - 1];

    sendMessage({
        chatId: message.from,
        image: car.img,
        caption: `🚗 *Hai acquistato una ${car.name}* per $${car.price}!`
    });
}
