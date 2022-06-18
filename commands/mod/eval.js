const Discord = require("discord.js");
const config = require("../../config/botconfig.json")
const Radio = require("../../Radio")
const Owner = config.Owner.eval

module.exports = {
    name: "eval",
    category: "moderation",
    args: true,

    run: async (client, message, args) => {
        if (Owner.includes(message.author.id)) {
            let evaled;
            try {
                evaled = await eval(args.join(" "));
                let evalend = new Discord.MessageEmbed()
                    .setTitle('Eval Result : ')
                    .setDescription('INPUT :\n```js\n' + args.join(" ") + '\n```\nOUTPUT :\n```js\n' + evaled + '\n```')
                    .setColor("GREEN")
                message.channel.send(evalend)
            }
            catch (error) {
                let evalerr = new Discord.MessageEmbed()
                    .setTitle('Thre Was An Error : ')
                    .setDescription('```js\n' + error + '```')
                    .setColor("RED")
                message.channel.send(evalerr)
            }
        }
    }
}