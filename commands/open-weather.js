module.exports = class OpenWeatherMap{

	// Prototype qui initialise les variables necessaires dans l'url de l'API
	constructor (APPID, units){
		this.APPID = APPID;
		this.units = units;
	}

	// Fonctions
	match (message) {
		return message.content.startsWith('!meteo')
	}

	action(message) {
		let args = message.content.split(' ')
		args.shift()
		let url= "http://api.openweathermap.org/data/2.5/weather?q="
		// Requete
		let requete = url.concat(args+"&APPID="+this.APPID+"&units="+this.units);

		// Variables messages que retournera le bot
		let msg = "Le temps est bon. Il fait ni trop chaud ni trop froid";
		let msg_2 = "Il fait beau et il y a du soleil.";

		fetch(requete)
			// Donnée lu et parsé
			.then(function(reponse){return reponse.json()})
			// Affichage de la donnée température json
			.then(function(data){
				//console.log(data)

				//Message temperature
				if(Number(data.main.temp)>30)
					msg = "Il fait très chaud.";
				else if(Number(data.main.temp)<10)
					msg = "Il fait plutôt froid.";

				//Message concernant le temps
				data.weather.forEach(function(res){
					if(res.main=="Rain")
						msg_2 = "Il pleut des gouttes.";
					else if(res.main=="Clouds")
						msg_2 = "Il fait très nuageux.";
				});
				message.channel.send(msg_2)
				message.channel.send('La température à '.concat(data.name+" est de "+data.main.temp+'°C. '+msg))
				message.channel.send('Les minimales sont de '.concat(data.main.temp_min+'°C. '))
				message.channel.send('Les maximales sont de '.concat(data.main.temp_max+'°C. '))
			});
	}
};
