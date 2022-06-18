const config = require("./config/botconfig.json")
const {
    sotikade,
    meme,
    music,
    romance,
    question,
    fun
} = config.Channels.React
const {
    msg_user,
    user_msg,
    msg_channel
} = config.Channels.msgGenesis

const {
    guild_id,
    channel_id,
    guild_id_test,
    channel_id_test
} = config.Channels.voice

const {
    Log_Bot,
} = config.Channels.log

const moment1 = require('moment-jalaali')
const moment = require('moment')


module.exports = {
    async React(message) {
        try { 
        if (message.channel.id == music) {
            message.react("🎶")
        }
        if (message.channel.id == romance) {
            message.react("❤️‍🩹")
            message.react("💔")
        }
        if (message.channel.id == sotikade) {
            message.react("😂")
            message.react("😐")
        }
        if (message.channel.id == meme) {
            message.react("😂")
        }
        if (message.channel.id == question) {
            message.react("❓")
        }
        if (message.channel.id == fun) {
            message.react("😂")
            message.react("😶‍🌫️")
        }
    } catch (e) {
        return console.log(e)
    }
    },
    async joinVoice(client) {
        let server = client.guilds.cache.get(guild_id);
        let channel = server.channels.cache.get(channel_id);
        await channel.join().then(connection => {
            connection.voice.setSelfMute(false)
            connection.voice.setSelfDeaf(true)
        })
    },
    async Status(client) {
        let server = client.guilds.cache.get(guild_id);
        function randomStatus() {
            let status = ["𝐆 𝐄 𝐍 𝐄 𝐒 𝐈 𝐒", `${server.memberCount} Member's`]
            let rstatus = Math.floor(Math.random() * status.length);
            let type = [1,2,3,4,5]
            let typestatus = Math.floor(Math.random() * type.length);
            client.user.setPresence({
                activity: {
                    name: status[rstatus],
                    type: type[typestatus],
                },
                status: "dnd"
            })
            //client.user.setActivity(status[rstatus], { type: "WATCHING" });
        }; setInterval(randomStatus, 11000)
    },
    async commandsFun(fs, client) {
        const ascii = require("ascii-table");

        // Create a new Ascii table
        let table = new ascii("Commands");
        table.setHeading("Command", "Load status");

        fs.readdirSync("./commands/").forEach(dir => {

            const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

            for (let file of commands) {
                let pull = require(`./commands/${dir}/${file}`)

                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    table.addRow(file, '✅');
                } else {
                    table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                    continue;
                }

                // If there's an aliases key, read the aliases.
                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
            }
            console.log(table.toString());
        });
    },
    async commandrun(message, client, prefix) {
        if (message.author.bot) return;

        if (!message.guild) return;
        if (!message.content.startsWith(prefix)) return;

        if (!message.member)
            message.member = message.guild.fetchMember(message);

        const args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd);

        if (!command) command = client.commands.get(client.aliases.get(cmd));

        if (command) command.run(client, message, args);
    },
    async msgUser(message, client) {
        if (message.channel.id == msg_user) {
            setTimeout(() => {
                if (!message.author.bot) message.delete()
            }, 8000);
            if (message.author.bot) return;
            const args = message.content.split(/ +/g);
            if (args[0].length <= 16) return message.channel.send(`<@${message.author.id}> ` + " ID user ra vared konid.")
                .then((mssg) => {
                    setTimeout(() => {
                        mssg.delete()
                    }, 5000)
                })
            try {
                client.users.cache.get(args[0])
                    .send(args.join(" ").split(args[0]))
                    .then(() => {
                        message.channel.send(`<@${message.author.id}> Done.`)
                            .then((msg) => {
                                setTimeout(() => {
                                    msg.delete()
                                }, 5000);
                            })
                            .catch((err) => {
                                return message.channel.send("```js" + err + "```")
                            })
                    })
            } catch (e) {
                return message.channel.send("```js" + e + "```")
            }


        }
    },
    async userMsg(message, client) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") {
            if (message.author.id == client.user.id) return;
            const User_Msg = client.channels.cache.get(user_msg);
            let User_id = message.author.id
            let User_name = message.author.username
            let Message_Data = message.content
            User_Msg.send("▬▬▬▬▬▬▬▬▬▬▬▬" + `<@${User_id}>` + "\n" + `**User:** __ ${User_name} (${User_id}) __` + "\n" + `Message in DM :\n${Message_Data}\n` + "▬▬▬▬▬▬▬▬▬▬▬▬")
        }
    },
    async Reconnect(newState, oldState, client) {
        const channel_Log = client.channels.cache.get(Log_Bot)
        const User_bot = client.user.id
        if (oldState.id === User_bot) {
            if (!oldState.channelID && newState.channelID) {
                let server = client.guilds.cache.get(guild_id);
                let channel = server.channels.cache.get(channel_id);
                let Time = moment().utcOffset("+04:30").format("LTS")
                await channel.join().then(connection => {
                    connection.voice.setSelfMute(true)
                    connection.voice.setSelfDeaf(true)
                    channel_Log.send(Time + " Reconneted...!")
                })
            }
        } else {
            return;
        }
    }
}