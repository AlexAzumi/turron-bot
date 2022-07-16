import util from 'minecraft-server-util';
import mpi from 'mc-player-api';
import { Client, Intents, MessageEmbed } from 'discord.js';

import { getUserSample } from './functions';

import { serverAddress, serverPort } from '../config.json';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('\nThe bot is up!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'server-status') {
    try {
      const serverStatus = await util.status(serverAddress, serverPort, {
        timeout: 5000,
        enableSRV: true,
      });

      const embedMessage = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Minecraft server status')
        .setDescription(serverStatus.motd.clean)
        .setThumbnail('attachment://favicon.png')
        .addField('Server address', serverStatus.srvRecord.host, true)
        .addField('Server port', serverStatus.srvRecord.port.toString(), true)
        .addField('Server version', serverStatus.version.name, true)
        .addField(
          'Players',
          `${serverStatus.players.online}/${serverStatus.players.max}`,
          true
        )
        .addField(
          'Online players',
          getUserSample(serverStatus.players.sample, 5),
          true
        );

      await interaction.reply({
        files: [
          {
            attachment: Buffer.from(
              serverStatus.favicon.split(',')[1],
              'base64'
            ),
            name: 'favicon.png',
          },
        ],
        embeds: [embedMessage],
      });
    } catch (error) {
      console.error(error);

      await interaction.reply('The server is offline!');
    }
  } else if (commandName === 'mc-user') {
    const username = interaction.options.getString('username', true);

    try {
      const userData = await mpi.getUser(username);

      const embedMessage = new MessageEmbed()
        .setColor('DARK_GREEN')
        .setTitle('Minecraft user')
        .setThumbnail(userData.skin_renders.head_render)
        .addField('Username', userData.username, true)
        .addField('Creation date', userData.created_at || 'Not available', true)
        .addField('UUID', userData.uuid);

      await interaction.reply({ embeds: [embedMessage] });
    } catch (error) {
      console.error(error);

      await interaction.reply('Not found user');
    }
  }
});

client.login(DISCORD_TOKEN);
