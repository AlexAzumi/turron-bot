const util = require('minecraft-server-util');
const { Client, Intents, MessageEmbed } = require('discord.js');

const { serverAddress, serverPort } = require('./config.json');

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/**
 * Gets the string of user samples
 * @param {Array<{ id: string, name: string }>} users - sample of users online in the server
 * @param {number} size - Amount of samples that will be shown
 */
const getUserSample = (users, size) => {
  if (users.length === 0) {
    return 'None';
  }

  let samplesInText = '';
  const sampleToUse = users.slice(0, size);

  sampleToUse.forEach((user) => {
    if (!samplesInText) {
      samplesInText = user.name;
    } else {
      samplesInText += `, ${user.name}`;
    }
  });

  return samplesInText;
};

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
  }
});

client.login(token);
