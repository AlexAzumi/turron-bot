const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('server-status')
    .setDescription('Replies with the Minecraft server status'),
  new SlashCommandBuilder()
    .setName('mc-user')
    .setDescription('Replies with the Minecraft user information')
    .addStringOption((option) =>
      option
        .setName('username')
        .setDescription('Minecraft username')
        .setRequired(true)
    ),
];

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => {
    console.log('Successfully registered application commands.');
  })
  .catch(console.error);
