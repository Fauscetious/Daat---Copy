const config = require('../config.json');
let turnArray = [];
let currentTurn = null;
let gameActive = false;

exports.run = (client, message, args) => {
    switch(args[0]){
        case "start":
            if(gameActive){
                message.channel.send(`A game is already in session (${turnArray.length} players participating).`);
            }else{
                gameActive = true;
                message.channel.send(`New game of Questions created! Please add participants using \"${config.prefix}questions add <user>\"`);
            }
            break;
        case "stop":
            if(gameActive){
                gameActive = false;
                turnArray = [];
                currentTurn = null;
                message.channel.send(`Current game of Questions has been closed!`);
            }else{
                message.channel.send(`There is currently no active game of Questions.`);
            }
            break;
        case "add":
            if(args.length !== 2){
                message.channel.send(`Invalid command; please use the format ${config.prefix}questions remove <player name>`);
            }
            if(gameActive){
                if(turnArray.includes(args[1])){
                    message.channel.send(`${args[1]} is already in the game.`);
                }else{
                    turnArray.push(args[1]);
                    message.channel.send(`Added ${args[1]} to the game!`);
                    if(turnArray.length === 1){
                        currentTurn = 0;
                    }
                }
            }else{
                message.channel.send(`There is currently no active game of Questions.`);
            }
            break;
        case "remove":
            if(args.length !== 2){
                message.channel.send(`Invalid command; please use the format ${config.prefix}questions remove <player name>`);
            }
            if(gameActive){
                let temp = turnArray[currentTurn];
                if(turnArray.includes(args[1])){
                    for(let i = 0; i < turnArray.length; i++){
                        if(turnArray[i] === args[1]){
                            turnArray.splice(i, 1);
                        }
                    }
                    for(let i = 0; i < turnArray.length; i++){
                        if(turnArray[i] === temp){
                            currentTurn = i;
                        }
                    }
                    if(turnArray.length === 0){
                        currentTurn = null;
                    }
                    message.channel.send(`Removed ${args[1]} from the game!`);
                }else{
                    message.channel.send(`${args[1]} is not currently in the game.`);
                }
            }else{
                message.channel.send(`There is currently no active game of Questions.`);
            }
            break;
        case "turn":
            if(gameActive){
                if(currentTurn !== null){
                    message.channel.send(turnArray[currentTurn]);
                }else{
                    message.channel.send(`There are currently no players in the game.`);
                }
            }else{
                message.channel.send(`There is currently no active game of Questions.`);
            }
            break;
        case "next":
            if(gameActive){
                if(currentTurn !== null){
                    if(currentTurn + 1 === turnArray.length){
                        currentTurn = 0;
                    }else{
                        currentTurn++;
                    }
                    message.channel.send(`It is currently ${turnArray[currentTurn]}'s turn.`)
                }else{
                    message.channel.send(`There are currently no players in the game.`);
                }
            }else{
                message.channel.send(`There is currently no active game of Questions.`);
            }
            break;
        case "list":
            if(gameActive){
                if(turnArray.length > 0){
                    message.channel.send(turnArray);
                }else{
                    message.channel.send("There are currently no players in the game.");
                }
            }else{
                message.channel.send("There is currently no active game of Questions.");
            }
            break;
        default:
            return;
    }
}