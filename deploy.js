import { REST, Routes } from 'discord.js';
import config from './config.json' with {type: 'json'}; 
import { importCommands } from './import/cmdCollection.js';

const commands = await importCommands();

let commandData = commands.map(command => command.data.toJSON());

const rest = new REST().setToken(config.DISCORD_TOKEN);

export async function deployCommands(guildId) {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(config.DISCORD_CLIENTID, guildId),
			{ body: commandData },
			// Routes.applicationCommands(config.clientId),
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
};