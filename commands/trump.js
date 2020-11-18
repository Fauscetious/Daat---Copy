const Tronald = require('tronalddump-io');
const trumpClient = new Tronald();

exports.run = (client, message, args) => {
    if(args.length > 0){
        trumpClient.search(args.join(' ')).then(returnedQuote => {
            if(typeof returnedQuote._embedded.quotes === 'undefined'){
                message.channel.send("Your search failed to yield any results.")
                return;
            }
            let quoteMessage = `\`\`\`Your search yielded the following quotes:\n\n`;
            let quoteLength = returnedQuote._embedded.quotes.length <= 3 ? returnedQuote._embedded.quotes.length : 3;
            for(let i = 0; i < quoteLength; i++){
                quoteMessage += `${returnedQuote._embedded.quotes[i].value}\n\n`;
            }
            quoteMessage = quoteMessage.slice(0, quoteMessage.length-2);
            quoteMessage += "\`\`\`";
            message.channel.send(quoteMessage);
        });
    }else{
        message.channel.send("Please input a valid search term.");
    }
}