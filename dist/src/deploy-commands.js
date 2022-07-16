"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const commands = [
    new builders_1.SlashCommandBuilder()
        .setName('server-status')
        .setDescription('Replies with the Minecraft server status'),
    new builders_1.SlashCommandBuilder()
        .setName('mc-user')
        .setDescription('Replies with the Minecraft user information')
        .addStringOption((option) => option
        .setName('username')
        .setDescription('Minecraft username')
        .setRequired(true)),
];
const rest = new rest_1.REST({ version: '9' }).setToken(token);
rest
    .put(v9_1.Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => {
    console.log('Successfully registered application commands.');
})
    .catch(console.error);
//# sourceMappingURL=deploy-commands.js.map