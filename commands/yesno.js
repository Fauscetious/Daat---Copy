exports.run = (client, message, args) => {
    /*
    if(message.author.id === "174401645570949120"){
        if(message.content.endsWith("?")){
            message.channel.send("No.");
            return;
        }else{
            message.channel.send("Yes.");
            return;
        }
    }
    */
    let result = Math.floor(Math.random()*2);
    message.channel.send(result === 0 ? "No.":"Yes.");
}