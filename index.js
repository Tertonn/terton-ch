const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.BOT_TOKEN;
const prefix = 'tr!';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const mood = [{
    word: 'Sad',
    emoji: ':cry:'
  },
  {
    word: 'Aggressive',
    emoji: ':angry:'
  },
  {
    word: 'Happy',
    emoji: ':relieved:'
  },
  {
    word: 'Silly',
    emoji: ':stuck_out_tongue_winking_eye:'
  },
  {
    word: 'Lonely',
    emoji: ':confounded:'
  },
  {
    word: 'Nervous',
    emoji: ':persevere:'
  },
  {
    word: 'Cool',
    emoji: ':sunglasses:'
  },
  {
    word: 'firedigger',
    emoji: ':firedigger:'
  },
  {
    word: 'А я тут причем?',
    emoji: 'BOGDANGTA BOGDANGTA BOGDANGTA'
  },
  {
    word: '*Honk*',
    emoji: 'HONK'
  },
  {
    word: 'Thinking',
    emoji: ':thinking:'
  }];
const currmood = mood[Math.floor(Math.random() * mood.length)];
console.log('My mood is ' + currmood.word);

bot.on('ready', () => {
    console.log('The bot is online!');
    bot.user.setActivity('tr!help', { type: "STREAMING" }).catch(console.error);
})

bot.on('disconnect', () => {
    console.log('The bot is now disconnected!');
})

bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return console.log('The "welcome" channel wasn\'t found!');
    channel.send(`Hey, ${member}, welcome to the osu!Hiragi official server! Send your osu!Hiragi profile link in this channel so we can verificate you!`);
    console.log(`${member.displayName} joined the server!`);
})

bot.on('message', message=>{
    let args = message.content.substring(prefix.length).split(' ');
    if (message.channel.type === "dm" && message.content === "А я тут причем?" && message.author.tag === "Terton#0688") {
        const guild = bot.guilds.get('577069216281395200');
        const channel = guild.channels.find(ch => ch.name === 'welcome');
        channel.send("The bot was disabled!");
    }

    switch(args[0]) {
        case 'help':
            message.channel.send("Currently available commands:");
            message.channel.send("info, profile(username|id, gamemode), status, last", { code: true });
            message.channel.send("Admin commands:");
            message.channel.send("clear", { code: true });
            break;
        case 'info':
            message.channel.send("This bot was made by Terton and basically it's meant to be used on official osu!Hiragi Discord server");
            break;
        case 'clear':
            if (message.member.hasPermission('ADMINISTRATOR')) {
                if (args[1] > 0) {
                    message.channel.bulkDelete(args[1]);
                } else message.channel.send("Invalid arguments!");
            } else message.channel.send("You don't have permission to do that!");
            break;
        case 'profile':
            if (!args[1]) {
                message.channel.send("Please specify the user you're searching for");
            } else {
                if (!args[2]) () => {return args[2]=0;}
                if (args[2] == 0 || args[2] == 1 || args[2] == 2 || args[2] == 3) {
                const url = 'https://osu.aestival.space/api/get_user?u=' + args[1] + '&m=' + args[2];
                fetch(url,{method: "GET", body: JSON.stringify()})
                .then(function(data) {
                    const jsonResponse = data.json();
                    return jsonResponse;
                })
                .then(function(jsonResponse) {
                if (!jsonResponse[0]) { 
                  message.channel.send("This user doesn't exist!");
                  return;
                }
                const username = jsonResponse[0].username;
                const pp = jsonResponse[0].pp_raw;
                const acc = jsonResponse[0].accuracy;
                const rank = jsonResponse[0].pp_rank;
                const pic = 'https://a.aestival.space/' + jsonResponse[0].user_id;
                const profEmbed = new Discord.RichEmbed()
                .setTitle("osu!Hiragi profile")
                .setColor(0xF97DCC)
                .setThumbnail('https://a.aestival.space/1006')
                .addField("Player Name", username)
                .addField("PP", pp, true)
                .addField("Accuracy", `${acc}%`)
                .addField("Rank", `#${rank}`);
                message.channel.send(profEmbed);
                }) } else {return message.channel.send("Invalid gamemode!");}
            }
            break;
      case 'status':
        const url = 'https://c.aestival.space/api/v1/onlineUsers';
        fetch(url,{method: "GET", body: JSON.stringify()})
        .then(function(data) {
              const jsonResponse = data.json();
              return jsonResponse;
        })
        .then(function(jsonResponse) {
          if (!jsonResponse) {
            return message.channel.send("Server is down!");
          }
          message.channel.send(`There is ${jsonResponse.result} users online now!`);
          message.channel.send(`My current mood is ${currmood.word} ${currmood.emoji}`);
          return;
        })
        break;
      case 'last':
        let gamemode;
        let URL;
        let pic;
        if (!args[1]) {
                message.channel.send("Please specify the user you're searching for");
            } else {
        if (args[1] === NaN) {
          if (args[2] === undefined) {
           gamemode = 0;
          } else { gamemode = args[2]; }
          URL = `https://osu.aestival.space/api/get_user_recent?u=${args[1]}&limit=1&type=string&m=${gamemode}`;
        }
        else {
        if (args[2] === undefined) {
          gamemode = 0;
        } else { gamemode = args[2]; }
        URL = `https://osu.aestival.space/api/get_user_recent?u=${args[1]}&m=${gamemode}`
        }
        fetch(URL,{method: "GET", body: JSON.stringify()})
        .then(function(data) {
          const jsonResponse = data.json();
          return jsonResponse;
        })
        .then(function(jsonResponse) {
          if (!jsonResponse[0]) {
            message.channel.send("Invalid username/id or the server is down!")
            return;
          }
          const score = jsonResponse[0].score;
          const combo = jsonResponse[0].maxcombo;
          const miss = jsonResponse[0].countmiss;
          let rank = jsonResponse[0].rank;
          if (rank === "SSHD") {rank = "XH"}
          if (rank === "SSH") {rank = "XH"}
          if (rank === "SS") {rank = "X"}
          pic = `https://s.ppy.sh/images/${rank}.png`
          const pp = jsonResponse[0].pp;
          const username = message.member.displayName;
          const date = jsonResponse[0].date;
          const bURL = `https://osu.aestival.space/api/get_beatmaps?limit=1&b=${jsonResponse[0].beatmap_id}`;
          fetch(bURL,{method: "GET", body: JSON.stringify()})
          .then(function(data) {
            const secondResponse = data.json();
            return secondResponse;
          })
          .then(function(secondResponse) {
          const artist = secondResponse[0].artist;
          const title = secondResponse[0].title;
          const diff = secondResponse[0].version;
          const maxcombo = secondResponse[0].max_combo;
          const lastEmbed = new Discord.RichEmbed()
              .setTitle(`${args[1]}'s Last Score`)
              .setColor(0xF97DCC)
              .setThumbnail(pic)
              .addField(`${artist} - ${title}[${diff}]`, "\u200B")
              .addField(`${pp}pp`, "\u200B")
              .addField("Total Score", score)
              .addField("Combo", `${combo}/${maxcombo}`)
              .addField("Miss", miss)
              .addField("Date", date);
          message.channel.send(lastEmbed);
          })
          
        })   
        }
    }
 }
)

bot.login(token);
