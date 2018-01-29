const Discord = require('discord.js')
const bot = new Discord.Client()
const Google = require('./commands/google')
const Ping = require('./commands/ping')
// const Play = require('./commands/play')
const Meteo = require('./commands/open-weather')
var apiai = require('apiai');
var config = require('./config');
var app = apiai(config.Dialogflow);
console.log(config);

//Instance météo
require('es6-promise').polyfill();
require('isomorphic-fetch');
let {API_KEY} = require('./codes/code_api_ow')
let instance_meteo = new Meteo(API_KEY,'metric');


bot.on('ready', function(){
  // bot.user.setAvatar('./avatar.png')
  //   .then(()=> console.log('avatar ok'))
  //   .catch(console.error)
  // bot.user.setGame('Préparation du chatbot LP')
  //   .then(()=> console.log('jeu ok'))
  //   .catch(console.error)
  
  console.log('Chatbot en route ! ');
})

bot.on('guildMemberAdd', function(member){
  member.createDM().then(function(channel){
    return channel.send('Bienvenu sur le channel ' + member.displayName)
  }).catch(console.error)
})

bot.on('message', function (message){
  // if(Google.match(message)){
  //   return Google.action(message)
  // }
  //
  // if(message.content === '!ping'){
  //   message.channel.send('pong')
  // }
  
  //let commandUsed = Google.parse(message) || Ping.parse(message) || Play.parse(message)
  
  
  /*if (Google.match(message)){
		return Google.action(message)
	}
	else if (instance_meteo.match(message)){
		return instance_meteo.action(message)
	}
	else if (message.content == '!ping'){
		message.channel.send('pong')
	}
	else if(message.content == '!bonjour'){
		message.reply('Bonjour à toi, je suis le bot de morgan !')
	}*/
	
	
})

bot.on('message', function(message){
        if((message.cleanContent.startsWith("@" + bot.user.username) || message.channel.type == 'dm') && bot.user.id != message.author.id){
        var mess = remove(bot.user.username, message.cleanContent);
        console.log(mess);
        const user = message.author.id;
		if (Google.match(message)){
		return Google.action(message)
		}
		else if (instance_meteo.match(message)){
			return instance_meteo.action(message)
		}
		else if (message.content == '!ping'){
			message.channel.send('pong')
		}
		else if(message.content == '!bonjour'){
			message.reply('Bonjour à toi, je suis le bot de morgan !')
		}
        var promise = new Promise(function(resolve, reject) {
            var request = app.textRequest(mess, {
                sessionId: user
            });
            request.on('response', function(response) {
                console.log(response);
                var rep = response.result.fulfillment.speech;
                resolve(rep);
            });

            request.on('error', function(error) {
                resolve(null);
            });

            request.end();
        });

        (async function(){
            var result = await promise;
            if(result){
                message.reply(result);
            } else{
                message.reply("nothing here");
            }
        }());

    }
});

function remove(username, text){
    return text.replace("@" + username + " ", "");
}


let {TOKEN} = require('./codes/code_token')
bot.login(TOKEN)
