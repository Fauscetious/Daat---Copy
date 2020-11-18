const DadJoke =  require('icanhazdadjoke-client');

const dadClient = new DadJoke.ICanHazDadJokeClient();

exports.run = (client, message, args) => {
    dadClient.getRandomJoke().then((returnedJoke =>{
        message.channel.send(returnedJoke.joke);
    }))
}