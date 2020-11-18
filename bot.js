const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const responses = require("./responses.json");

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let eventFunction = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

client.on("message", message => {
    if (message.author.bot) return;
    //for messages that don't start with prefix
    if(!message.content.startsWith(config.prefix)){
        if(message.content.toLowerCase().endsWith(" soon") || message.content === "soon"){
            message.react('™');
            return;
        }
        if(message.content.toLowerCase() === "ayy"){
            let reactions = ['🇱', '🇲', '🇦', '🇴', '👽'];
            let waittime = 0;
            reactions.forEach(emoji => {
                setTimeout(function(){
                    message.react(emoji);
                }, waittime);
                waittime += 1000;
            });
        }
        if(message.isMentioned(client.user) && (message.content.endsWith("thanks") || message.content.endsWith("thank you"))){
            message.channel.send(responses[(Math.floor(Math.random()*responses.count))]);
        }
        return;
    }
   
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    
    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
    }
    
});

client.login(config.token);