import { Client, GatewayIntentBits } from 'discord.js';
import config from './config.json' with {type: 'json'};
import { readEvents } from './import/eventReader.js';
import { loadCommands } from './import/cmdCollection.js';


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

try {
    await loadCommands(client);
    await readEvents(client);
    await client.login(config.DISCORD_TOKEN);
} catch (error) {
    console.error('Failed to initialize the bot:', error);
    process.exit(1);
}
