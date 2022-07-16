"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minecraft_server_util_1 = __importDefault(require("minecraft-server-util"));
const mc_player_api_1 = __importDefault(require("mc-player-api"));
const discord_js_1 = require("discord.js");
const functions_1 = require("./functions");
const config_json_1 = require("../config.json");
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
client.once('ready', () => {
    console.log('\nThe bot is up!');
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    if (commandName === 'server-status') {
        try {
            const serverStatus = yield minecraft_server_util_1.default.status(config_json_1.serverAddress, config_json_1.serverPort, {
                timeout: 5000,
                enableSRV: true,
            });
            const embedMessage = new discord_js_1.MessageEmbed()
                .setColor('BLUE')
                .setTitle('Minecraft server status')
                .setDescription(serverStatus.motd.clean)
                .setThumbnail('attachment://favicon.png')
                .addField('Server address', serverStatus.srvRecord.host, true)
                .addField('Server port', serverStatus.srvRecord.port.toString(), true)
                .addField('Server version', serverStatus.version.name, true)
                .addField('Players', `${serverStatus.players.online}/${serverStatus.players.max}`, true)
                .addField('Online players', (0, functions_1.getUserSample)(serverStatus.players.sample, 5), true);
            yield interaction.reply({
                files: [
                    {
                        attachment: Buffer.from(serverStatus.favicon.split(',')[1], 'base64'),
                        name: 'favicon.png',
                    },
                ],
                embeds: [embedMessage],
            });
        }
        catch (error) {
            console.error(error);
            yield interaction.reply('The server is offline!');
        }
    }
    else if (commandName === 'mc-user') {
        const username = interaction.options.getString('username', true);
        try {
            const userData = yield mc_player_api_1.default.getUser(username);
            const embedMessage = new discord_js_1.MessageEmbed()
                .setColor('DARK_GREEN')
                .setTitle('Minecraft user')
                .setThumbnail(userData.skin_renders.head_render)
                .addField('Username', userData.username, true)
                .addField('Creation date', userData.created_at || 'Not available', true)
                .addField('UUID', userData.uuid);
            yield interaction.reply({ embeds: [embedMessage] });
        }
        catch (error) {
            console.error(error);
            yield interaction.reply('Not found user');
        }
    }
}));
client.login(DISCORD_TOKEN);
//# sourceMappingURL=index.js.map