/* MIT License

Copyright (c) 2017  M.Delory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.  */


const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require("weather-js");
const token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const Wiki = require("wikijs");


var yt = require("./youtube_plugin");
var youtube_plugin = new yt();
var AuthDetails = require("./auth.json");
var prefix = ".";
var mention = "<@193090335XXXXXXXX>";


client.on("ready", () => {
    var servers = client.guilds.array().map(g => g.name).join(',');
    console.log("--------------------------------------");
    console.log('[!]Connexion en cours... \n[!]Veuillez Patienter! \n[!] Mon bot est un flemmard , il démarre lentement ! \n[!]Les préfix actuelle:  ' + prefix + "\n[!]Mentions = " + mention + "\n");
});

client.on('message', message => {
    if(!message.guild) return; // Evite les erreurs lors d'un DM avec restriction par role
    var role = message.guild.roles.find("name","Admin");
    var author = message.author;
    var salut = message.content.toUpperCase();
    var array_msg = message.content.split(' ');

    if(salut === "SALUT"){
        if(message.member.roles.get(role.id)){
            message.reply("Bonjour, Maître !");
        }
        else{
            message.reply("Salutation mortel.");
        }
    } 

    switch(array_msg[0]){
        case("!help") :
            if(message.member.roles.get(role.id)){
                try{
                   let m = " ";
                    m += 'Les commandes admin sont :\n';
                    m += '!kick @Mention : pour kick la personne mentionnée du serveur.\n';
                    m += '!ban @Mention : pour bannir la personne mentionnée du serveur.\n';
                    message.author.sendMessage(m).catch(console.log);
                }
                catch(err) {
                    message.reply(member + "Idk pourquoi c'est cassé tbh :(");
                }
            }
            message.reply('Commandes du bot :\n !help : Affiche l\'aide \n !stats : Envoi les statistiques du serveur en message privé \n !meteo : Suivi de la localisation (Ville Pays) , Affiche la méteo \n !wiki : Suivi de votre recherche , pour effectuer une recherche Wikipédia \n !youtube : Suivi de votre recherche , pour afficher une vidéo Youtube');        
        break;
        
        case("!botname"):
            client.user.setUsername(message.content.substr(9));
        break;

        case("!stats"):
            let m = " ";
            m += 'Il y a actuellement '+message.guild.channels.size+' channels sur ce serveurs \n';
            m += 'Je suis en compagnie de '+message.guild.members.size+' membres.';
            message.author.sendMessage(m).catch(console.log);
        break;

        case("!meteo"):
            var location = message.content.substr(6);
            var unit = "C";
            try {
                weather.find({search: location, degreeType: unit}, function(err, data) {
                    if(err) {
                        console.log(Date.now(), "DANGER", "Je ne peut pas trouvé d'information pour la méteo de " + location);
                        message.reply("\n" + "Je ne peut pas trouvé d'information pour la méteo de " + location);
                    } 
                    else {
                        data = data[0];
                        console.log("**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
                        message.reply("\n" + "**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
                    }
                });
            } 
            catch(err) {
                console.log(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
                message.reply("Idk pourquoi c'est cassé tbh :(");
            }
        break;

        case("!wiki"):
                if(!message.content.substr(5)) {
                    console.log(Date.now(), "DANGER", "Vous devez fournir un terme de recherche.");
                    message.reply("Vous devez fournir un terme de recherche.");
                    return;
                }
            var wiki = new Wiki.default();
            wiki.search(message.content.substr(5)).then(function(data) {

                    if(data.results.length==0) {
                        console.log(Date.now(), "DANGER","Wikipedia ne trouve pas ce que vous avez demandée : " + message.content.substr(5));
                        message.reply("Je ne peut trouvé ce que vous voulez dans Wikipedia :(");
                        return; 
                    }
                wiki.page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {

                        if(summary.indexOf(" may refer to:") > -1 || summary.indexOf(" may stand for:") > -1) {

                            var options = summary.split("\n").slice(1);
                            var info = "Selectioné une options parmis celle-ci :";
                            
                            for(var i=0; i<options.length; i++) {
                                info += "\n\t" + i + ") " + options[i];
                            }

                        message.reply(info);
                        selectMenu(message.channel, message.author.id, function(i) {

                            commands.wiki.process(Client, message, options[i].substring(0, options[i].indexOf(",")));
                        }, options.length-1);

                    } 
                        else {
                            var sumText = summary.split("\n");
                            var count = 0;
                            
                            var continuation = function() {
                            var paragraph = sumText.shift();
                                if(paragraph && count<3) {
                                    count++;
                                    message.reply(message.channel, paragraph, continuation);
                                }

                            };
                            message.reply("**Trouvé " + page.raw.fullurl + "**", continuation);
                         }

                    });
                });
            }, function(err) {
                console.log(Date.now(), "ERREUR","Impossible de se connecté a Wikipédia");
                message.reply("Uhhh...Something went wrong :(");
            });
        break;

        case("!youtube"):
            youtube_plugin.respond(message.content, message.channel , client);
        break;

        /*var user = message.content.substr(5);
        var id_user = client.users.find('username', user);
        if (["76841662445256704","200437873252630529"].indexOf(message.author.id) > -1 && message.content.startsWith("!eval")) {
            try {
                 eval(message.content.substring(5, message.content.length));
             } catch (e) {
                  message.reply(message.channel.id, e);
             }
         } else return;
        */
        case("!kick"):
             if(message.member.roles.get(role.id)){
                try{
                    let d = message.mentions.users.first() 
                    let server = client.guilds.get(message.guild.id);
                    let member = server.members.find(memb => memb.id == d.id);
                    member.kick(function(){
                       
                    });
                    message.reply(" a kick " + member + " du serveur !");
                }
                catch(err) {
                    message.reply(member + "Idk pourquoi c'est cassé tbh :(");
                }
            }
            else{
                message.reply("Vous n'avez pas ce pouvoir , mortel !");
            }
        break; 

    } 

});

client.login(token)
