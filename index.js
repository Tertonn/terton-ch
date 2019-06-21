const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'process.env.BOT_TOKEN';
const prefix = 'tr!';   


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
            message.channel.send("info", { code: true });
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
    }
 }
)


bot.login(token);
