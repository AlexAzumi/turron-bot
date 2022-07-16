const util = require('minecraft-server-util');
const { Client, Intents, MessageEmbed } = require('discord.js');

const { serverAddress, serverPort } = require('./config.json');

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Ready!');
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
          serverStatus.players.sample > 0
            ? serverStatus.players.sample.reduce(
                (previousValue, currentValue, currentIndex) => {
                  if (currentIndex === 0) {
                    return `${currentValue.name}`;
                  } else {
                    return `${previousValue.name}, ${currentValue.name}`;
                  }
                }
              )
            : 'None',
          true
        );

      await interaction.reply({ embeds: [embedMessage] });
    } catch (error) {
      console.error(error);

      await interaction.reply('The server is offline!');
    }
  }
});

client.login(token);
