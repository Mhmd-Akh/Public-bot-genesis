const { Client, Discord, Collection, ClientUser } = require('discord.js')
const client = new Client();
const fs = require("fs")
const config = require("./config/botconfig.json")
const prefix = config.Client.prefix
const moment = require("moment")
const {
    joinVoice,
    React,
    Status,
    commandsFun,
    commandrun,
    msgUser,
    userMsg,
    Reconnect,
} = require("./function")
// const menuRole = require("./rolepick")
// const Radio = require("./Radio")

// Radio(client);
// menuRole(client)

client.login(config.Client.Token)

client.commands = new Collection();
client.aliases = new Collection();

client.on("ready", () => {
    console.log(client.user.tag);
    joinVoice(client)
    Status(client)
})

commandsFun(fs, client)

 client.on("message", async (message) => {
    React(message)
    commandrun(message, client, prefix)
    msgUser(message, client)
    userMsg(message, client)
 });

client.on("voiceStateUpdate", async (newState , oldState) => {
    Reconnect(newState, oldState, client)
})

client.on("warn", (info) => console.log(info));
client.on("error", console.error);