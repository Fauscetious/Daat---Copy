const config = require("../config.json");

exports.run = (client, message, args) => {
    if(args.length !== 1){
        message.channel.send(`Invalid command; please use the format \"${config.prefix}prefix <your prefix here>\".`);
    }else{
        config.prefix = args[0];
        message.channel.send(`Prefix changed to \"${config.prefix}\" !`);
        fs.writeFile("./home/container/config.json", JSON.stringify(config), (err) => console.error);
        client.user.setActivity(`${args[0]}help ☕️`, {type: "PLAYING"});
    }
}