import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'url';
import path from 'path';
import { Collection } from 'discord.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blacklist = [
    // command name
	'set_notification'
	
];

export async function importCommands(includeHelp = true) {
	const commands = [];

	const commandsPath = path.join(__dirname, '..', 'commands');
	const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = join(commandsPath, file);

		if (file.includes('help.js') && !includeHelp) {
			continue;
		}

		const command = await import('file://' + filePath);
	
		if (blacklist.includes(command.default.data.name)) {
			console.log(`[WARNING] The command at ${filePath} is blacklisted and will not be loaded.`);
			continue;
		}
	
		if (command.default && 'data' in command.default && 'execute' in command.default) {
			commands.push(command.default);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	
	return commands;
}

export async function loadCommands(client) {
	client.commands = new Collection();
	

	const commandsPath = path.join(__dirname, '..', 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        const command = await import('file://' + filePath);

        if (command.default && 'data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}