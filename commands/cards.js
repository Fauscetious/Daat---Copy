const config = require('../config.json');
const cardLog = require('../cards.json');

class Player{
    constructor(name, id){
        this._name = name;
        this._id = id;
        this._handArray = [];
    }

    get name(){
        return this._name;
    }
    get handArray(){
        return this._handArray;
    }
    get id(){
        return this._id;
    }

    addCard(card){
        if(this._handArray.length === 0){
            this._handArray = [card];
        }else{
            this._handArray.push(card);
        }
    }
    removeCard(card){
        for(let i = 0; i < this._handArray.length; i++){
            if(this._handArray[i] === card){
                return this._handArray.splice(i, 1);
            }
        }
    }
}

class CardGame{
    constructor(name, jokers){
        this._deckArray = [
            "aceSpades", "twoSpades", "threeSpades", "fourSpades", "fiveSpades", "sixSpades", "sevenSpades", "eightSpades", "nineSpades", "tenSpades", "jackSpades",
            "queenSpades", "kingSpades", "aceClubs", "twoClubs", "threeClubs", "fourClubs", "fiveClubs", "sixClubs", "sevenClubs", "eightClubs", "nineClubs", "tenClubs", 
            "jackClubs", "queenClubs", "kingClubs", "aceDiamonds", "twoDiamonds", "threeDiamonds", "fourDiamonds", "fiveDiamonds", "sixDiamonds", "sevenDiamonds", 
            "eightDiamonds", "nineDiamonds", "tenDiamonds", "jackDiamonds", "queenDiamonds", "kingDiamonds", "aceHearts", "twoHearts", "threeHearts", "fourHearts", "fiveHearts", 
            "sixHearts", "sevenHearts", "eightHearts", "nineHearts", "tenHearts", "jackHearts", "queenHearts", "kingHearts"
        ];
        if(jokers){
            this._deckArray.push("blackJoker", "redJoker");
        }
        this._jokers = jokers;
        this._name = name;
        this._playerArray = [];
    }

    
    shuffle(){
        let shuffledDeck = [];
        while(this.deckArray.length !== 0){
            shuffledDeck = shuffledDeck.concat(this.deckArray.splice(Math.floor(Math.random()*this.deckArray.length-1), 1));
        }
        if(this.deckArray.length === 0){
            this.deckArray = shuffledDeck;
        }
    }

    status(){
        return [this._name, this.deckArray.length, this.playerArray, this._jokers];
    }

    addPlayer(player){
        if(this.playerArray.length === 0){
            this.playerArray = [player];
        }else{
            this.playerArray.push(player);
        }
    }

    //NOTE: DEFAULT HANDLING OF REMOVED PLAYER'S CARDS IS TO PUT AT BOTTOM OF DECK
    removePlayer(player){
        let count = 0;
        for(let i = 0; i < this.playerArray.length; i++){
            if(this.playerArray[i].id === player){
                if(this.playerArray[i].handArray.length !== 0)this.deckArray = this.deckArray.concat(this.playerArray[i].handArray);
                return this.playerArray.splice(i, 1);
            }
            count++;
        }
        if(count === this.playerArray.length)return null;
    }

    foundPlayer(player){
        let count = 0;
        for(count; count < this.playerArray.length; count++){
            if(this.playerArray[count].id === player){
                return this.playerArray[count];
            }
        }
        if(count === this.playerArray.length)return null;
    }

    addCard(card, location){
        if(!(card in cardLog)) 
            return `Invalid card; cards should be written as "cardSuit" (e.g aceSpades)`;
        if(location === "decktop"){
            this.deckArray.unshift(card);
            return `Added ${card} to top of deck.`;
        }else if(location === "deckbottom"){
            this.deckArray.push(card);
            return `Added ${card} to bottom of deck.`;
        }
        let count = 0;
        for(count; count < this.playerArray.length; count++){
            if(this.playerArray[count].name === location){
                this.playerArray[count].addCard(card);
                return `Added ${card} to ${location}.`;
            }
        }
        if(count === this.playerArray.length){
            return `Could not find ${location} as a valid location. Valid locations include player names, decktop, and deckbottom.`;
        }
    }

    removeCard(card, location){
        if(!(card in cardLog))
            return `Invalid card; cards should be written as "cardSuit" (e.g aceSpades)`;
        if(location === "deck"){
            let count = 0;
            for(count; count < this.deckArray.length; count++){
                if(this.deckArray[count] === card){
                    this.deckArray.splice(count, 1);
                    return `Removed ${card} from deck.`;
                }
            }
            if(count === this.deckArray.length){
                return `Could not find ${card} within deck.`;
            }
        }else{
            let count = 0;
            for(count; count < this.playerArray.length; count++){
                if(this.playerArray[count].name === location){
                    let handCount = 0;
                    for(handCount; handCount < this.playerArray[count].handArray.length; handCount++){
                        if(this.playerArray[count].handArray[handCount] === card){
                            this.playerArray[count].handArray.splice(handCount, 1);
                            return `Removed ${card} from ${this.playerArray[count].name}.`;
                        }
                    }
                    if(handCount === this.playerArray[count].handArray.length){
                        return `Could not find ${card} within ${location}'s hand.`;
                    }
                }
            }
            if(count === this.playerArray.length){
                return `Could not find ${location} as a valid location. Valid locations include player names and deck`;
            }
        }
    }
    
    getCard(cardIndex, location){
        if(location === "deck"){
            if(cardIndex < this.deckArray.length){
                return this.deckArray.splice(cardIndex, 1)[0];
            }else{
                return null;
            }
        }else{
            let count = 0;
            for(count; count < this.playerArray.length; count++){
                if(this.playerArray[count].name === location){
                    if(cardIndex < this.playerArray[count].handArray.length){
                        return this.playerArray[count].handArray.splice(cardIndex, 1)[0];
                    }else{
                        return null;
                    }
                }
            }
            if(count === this.playerArray.length)return null;
        }
    }

    moveCard(card, loc1, loc2){
        if(card === "decktop")
            card = this.getCard(0, "deck");
        if(card === "deckbottom")
            card = this.getCard(this.deckArray.length-1, "deck");
        this.removeCard(card, loc1);
        this.addCard(card, loc2);
    }

    get deckArray(){
        return this._deckArray;
    }

    set deckArray(newDeckArray){
        this._deckArray = newDeckArray;
    }

    get playerArray(){
        return this._playerArray;
    }

    set playerArray(newPlayerArray){
        this._playerArray = newPlayerArray;
    }

    get name(){
        return this._name;
    }
}


class Mao extends CardGame{
    constructor(jokers){
        super(jokers);
        this._discardArray = [];
    }

    shuffle(){
        if(this._discardArray.length > 1){
            super.deckArray = super.deckArray.concat(this.discardArray.splice(1, this.discardArray.length-1));
        }
        super.shuffle();
    }

    status(){
        let topCard = this.discardArray.length === 0 ? null: this.discardArray[0];
        return super.status().concat([this.discardArray.length, topCard]);
    }

    addCard(card, location){
        if(!(card in cardLog)) 
            return `Invalid card; cards should be written as "cardSuit" (e.g aceSpades)`;
        if(location === "discardtop"){
            if(this.discardArray.length === 0){
                this.discardArray = [card];
            }else{
                this.discardArray.unshift(card);
            }
            return `Added ${card} to top of discard.`;
        }else if(location === "discardbottom"){
            if(this.discardArray.length === 0){
                this.discardArray = [card];
            }else{
                this.discardArray.push(card);
            }
            return `Added ${card} to bottom of discard.`;
        }
        return super.addCard(card, location);
    }

    removeCard(card, location){
        if(!(card in cardLog))
            return `Invalid card; cards should be written as "cardSuit" (e.g aceSpades)`;
        if(location === "discard"){
            let count = 0;
            for(count; count < this.discardArray.length; count++){
                if(this.discardArray[count] === card){
                    this.discardArray.splice(count, 1);
                    return `Removed ${card} from discard.`;
                }
            }
            if(count === this.discardArray.length){
                return `Could not find ${card} within discard.`;
            }
        }else{
            return super.removeCard(card, location);
        }
    }

    getCard(cardIndex, location){
        if(location === "discard"){
            if(cardIndex < this.discardArray.length){
                return this.discardArray.splice(cardIndex, 1)[0];
            }else{
                return null;
            }
        }else{
            return super.getCard(cardIndex, location);
        }
    }

    moveCard(card, loc1, loc2){
        if(card === "discardtop")
            card = this.getCard(0, "discard");
        if(card === "discardbottom")
            card = this.getCard(this.discardArray.length-1, "discard");
        super.moveCard(card, loc1, loc2);
    }

    get discardArray(){
        return this._discardArray;
    }

    set discardArray(newDiscardArray){
        this._discardArray = newDiscardArray;
    }
}


function handStatus(player){
    let statusArray = [];
    let count = 0;
    for(count; count < player.handArray.length; count++){
        let color;
        if(player.handArray[count].endsWith("Spades")|| player.handArray[count].endsWith("Clubs") || player.handArray[count].startsWith("black")){
            color = 1;
        }else{
            color = 16711710;
        }
        statusArray.push({
            cardName: player.handArray[count],
            color: color,
            url: cardLog[player.handArray[count]]
         });
    }
    if(count === player.handArray.length){
        return statusArray;
    }
}

function cardEmbedMaker(card){
    let color;
    if(card.endsWith("Spades") || card.endsWith("Clubs") || card.startsWith("black")){
        color = 1;
    }else{
        color = 16711710;
    }
    return {cardName: card, color: color, url: cardLog[card]};
}

let cards = null;
exports.run = (client, message, args) => {
    switch(args[0]){
        case "start":
            if(cards){
                message.channel.send(`There is already a card game in session.`);
                return;
            }
            if(args.length == 2){
                switch(args[1]){
                    case "Mao":
                    cards = new Mao("Mao", false);
                    message.channel.send("Started a new game of Mao.");
                    cards.shuffle();
                    break;
                    default:
                        message.channel.send(`Couldn't find ${args[1]} as a valid game type.`);
                    return;
                }
            }else{
                message.channel.send(`Invalid command; please use the format \"${config.prefix}cards start <game type>\".`);
            }
            break;
        case "stop":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            cards = null;
            message.channel.send("Ended the current card game.");
            break;
        case "shuffle":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
            }
            cards.shuffle();
            message.channel.send("Shuffled the deck.");
            break;
        case "status":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            let status = cards.status();
            let players = "";
            if(status[2].length === 0){
                players = "None  ";
            }else{
                status[2].forEach(player => {
                    players += player.name+", ";
                });
            }
            if(cards.name === "Mao"){
                let discardTop;
                if(status[5] === null){
                    discardTop = "https://i.imgur.com/K19tNpe.png";
                }else{
                    discardTop = cardLog[status[5]];
                }
                message.channel.send({embed: {
                    "title": "**__Current Card Game Status__**",
                    "description": `Game Type: ${status[0]}`,
                    "color": 0,
                    "image": {
                        "url" : discardTop
                    },
                    "fields": [
                    {
                        "name": "Deck Size",
                        "value": status[1],
                        "inline": true
                    },
                    {
                        "name": "Discard Size",
                        "value": status[4],
                        "inline": true
                    },
                    {
                        "name": "Players",
                        "value": players.slice(0, players.length-2)
                    },
                    {
                        "name": "---",
                        "value": "Top of discard pile:"
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                    icon_url: client.user.avatarURL,
                    text: "© HH 2019"
                    }
                }});
            }else{
                message.channel.send({embed: {
                    "title": "**__Current Card Game Status__**",
                    "description": `Game Type: ${status[0]}`,
                    "color": 0,
                    "fields": [
                    {
                        "name": "Deck Size",
                        "value": status[1],
                    },
                    {
                        "name": "Players",
                        "value": players.slice(0, players.length-2)
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                    icon_url: client.user.avatarURL,
                    text: "© HH 2019"
                    }
                }});
            }
            break;
        case "join":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            if(args.length === 1){
                let testCount = 0;
                cards.playerArray.forEach(player => {
                    if(player.id === message.author.id){
                        message.channel.send(`${message.author.username} is already in the game.`);
                        return;
                    }
                    testCount++;
                });
                if(testCount === cards.playerArray.length){
                    cards.addPlayer(new Player(message.author.username, message.author.id));
                    message.channel.send(`Added ${message.author.username} to the game!`);
                }
            }else{
                message.channel.send(`Invalid command; please use the format \"${config.prefix}cards join\".`);
            }
            break;
        case "leave":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            if(args.length !== 1){
                message.channel.send(`Invalid command; please use the format \"${config.prefix}cards leave\".`);
                return;
            }
            if(cards.removePlayer(message.author.id) === null){
                message.channel.send(`Could not find ${message.author.username} as a contestant.`);
            }else{
                message.channel.send(`Removed ${message.author.username} from the game!`);
            }
            break;
        case "addcard":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            if(args.length === 3){
                message.channel.send(cards.addCard(args[1], args[2]));
            }else{
                message.channel.send(`Invalid command; please use the format \"${config.prefix}cards addcard <card name> <location>\".`);
            }
            break;
        case "removecard":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            if(args.length === 3){
                message.channel.send(cards.removeCard(args[1], args[2]));
            }else{
                message.channel.send(`Invalid command; please use the format \"${config.prefix}cards removecard <card name> <location>\".`);
            }
            break;
        case "hand":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            let playerFound = cards.foundPlayer(message.author.id);
            if(playerFound !== null){
                let handState = handStatus(playerFound);
                let handCount = 0;
                message.author.send("```Current hand status:```");
                handState.forEach(handCard => {
                    message.author.send({embed: {
                        "title": handCard.cardName,
                        "color": handCard.color,
                        "timestamp": new Date(),
                        "image": {
                          "url": handCard.url
                        },
                      }
                    });
                    handCount++;
                });
                message.channel.send(`${message.author.username} has ${handCount} cards in hand.`);
            }else{
                message.channel.send(`Could not find ${message.author.username} as a contestant.`);
            }
            break;
        case "draw":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            let drawPlayer = cards.foundPlayer(message.author.id);
            if(drawPlayer !== null){
                if(cards.deckArray.length === 0){
                    message.channel.send("There are no cards remaining in the deck.");
                    break;
                }
                if(args.length === 2){
                    let drawCount = 0;
                    for(drawCount; drawCount < cards.playerArray.length; drawCount++){
                        if(cards.playerArray[drawCount].name === args[1]){
                            cards.moveCard("decktop", "deck", args[1]);
                            message.channel.send(`Forced ${args[1]} to draw a card from the top of the deck.`);
                            break;
                        }
                    }
                    if(drawCount === cards.playerArray.length){
                        message.channel.send(`Could not find ${args[1]} as a contestant.`);
                    }
                }else{
                    cards.moveCard("decktop", "deck", message.author.username);
                    message.channel.send(`${message.author.username} drew a card from the top of the deck.`);
                }
            }else{
                message.channel.send(`Could not find ${message.author.username} as a contestant.`);
            }
            break;
        case "deal":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            let dealPlayer = cards.foundPlayer(message.author.id);
            if(dealPlayer !== null){
                if(args.length === 2){
                    if(isNaN(args[1])){
                        message.channel.send(`Invalid card count: ${args[1]} is not a number.`);
                        break;
                    }
                    if(cards.deckArray.length < parseInt(args[1])){
                        message.channel.send(`There are not enough cards in the deck to draw (deck size: ${cards.deckArray.length})`);
                        break;
                    }
                    let dealCount = 0;
                    for(dealCount; dealCount < parseInt(args[1]); dealCount++){
                        cards.moveCard("decktop", "deck", message.author.username);
                    }
                    if(dealCount === parseInt(args[1])){
                        message.channel.send(`${message.author.username} drew ${args[1]} cards from the deck.`);
                    }
                }else{
                    message.channel.send(`Invalid command; please use the format ${config.prefix}cards deal <card count>`);
                }
            }else{
                message.channel.send(`Could not find ${message.author.username} as a contestant.`);
            }
            break;
        case "discard":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            if(args.length == 2){
                if(!(args[1] in cardLog)){
                    message.channel.send(`Invalid card; cards should be written as "cardSuit" (e.g aceSpades)`);
                    break;
                }
                let discardPlayer = cards.foundPlayer(message.author.id);
                if(discardPlayer !== null){
                    let discardCount = 0;
                    let foundCard = false;
                    for(discardCount; discardCount < discardPlayer.handArray.length; discardCount++){
                        if(discardPlayer.handArray[discardCount] === args[1]){
                            foundCard = true;
                            let discardedCard = cardEmbedMaker(args[1]);
                            cards.moveCard(args[1], message.author.username, "discardtop");
                            message.channel.send(`${message.author.username} discarded ${args[1]}`);
                            message.channel.send({embed: {
                                "title": discardedCard.cardName,
                                "color": discardedCard.color,
                                "timestamp": new Date(),
                                "image": {
                                "url": discardedCard.url
                                }
                            }});
                            break;
                        }
                    }
                    if(discardCount === discardPlayer.handArray.length && foundCard === false){
                        message.channel.send(`Could not find ${args[1]} in ${message.author.username}'s hand.`);
                    }
                }else{
                    message.channel.send(`Could not find ${message.author.username} as a contestant.`);
                }
            }else{
                message.channel.send(`Invalid command; please use the format \"${config.prefix}cards discard <card name>`);
            }
            break;
        case "flip":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                return;
            }
            let flipPlayer = cards.foundPlayer(message.author.id);
            if(flipPlayer !== null){
                if(cards.deckArray.length === 0){
                    message.channel.send("There are currently no cards in the deck.");
                    break;
                }
                let discardedCard = cardEmbedMaker(cards.deckArray[0]);
                cards.moveCard("decktop", "deck", "discardtop");
                message.channel.send(`Flipped the top card from deck onto discard.`);
                message.channel.send({embed: {
                    "title": discardedCard.cardName,
                    "color": discardedCard.color,
                    "timestamp": new Date(),
                    "image": {
                      "url": discardedCard.url
                    }
                  }
                });
            }else{
                message.channel.send(`Could not find ${message.author.username} as a contestant.`);
            }
            break;
        case "reverse":
            if(!cards){
                message.channel.send(`There is no currently active game of cards.`);
                break;
            }
            if(cards.name !== "Mao"){
                message.channel.send(`Invalid command for this game type.`);
                break;
            }
            let reversePlayer = cards.foundPlayer(message.author.id);
            if(reversePlayer !== null){
                if(cards.discardArray.length === 0){
                    message.channel.send("There are no cards remaining in the discard.");
                    break;
                }
                if(args.length === 2){
                    let discardCount = 0;
                    for(discardCount; discardCount < cards.playerArray.length; discardCount++){
                        if(cards.playerArray[discardCount].name === args[1]){
                            cards.moveCard("discardtop", "discard", args[1]);
                            message.channel.send(`Forced ${args[1]} to draw their card from the top of the discard.`);
                            if(cards.discardArray.length === 0){
                                message.channel.send({embed: {
                                    "title": "Empty Discard",
                                    "color": 1,
                                    "timestamp": new Date(),
                                    "image": {
                                    "url": "https://i.imgur.com/K19tNpe.png"
                                    }
                                }});
                            }else{
                                let discardedCard = cardEmbedMaker(cards.discardArray[0]);
                                message.channel.send({embed: {
                                    "title": discardedCard.cardName,
                                    "color": discardedCard.color,
                                    "timestamp": new Date(),
                                    "image": {
                                    "url": discardedCard.url
                                    }
                                }});
                            }
                            break;
                        }
                    }
                    if(discardCount === cards.playerArray.length){
                        message.channel.send(`Could not find ${args[1]} as a contestant.`);
                    }
                }
            }else{
                message.channel.send(`Could not find ${message.author.username} as a contestant.`);
            }
            break;
    }
}