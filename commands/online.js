import { SlashCommandBuilder } from 'discord.js';
import { fetchApi } from '../utils/fetch_api.js';

const help = {
    name: "online",
    description: "Fetches online player count.",
};

const data = new SlashCommandBuilder()
		.setName(help.name)
		.setDescription(help.description);

async function execute(interaction) {
    await interaction.deferReply();
    
    const onlinePlayer = await fetchApi('https://patch.dboglobal.to:5000/playersOnline', 'There are currently', '', 'players online.');

    await interaction.editReply({ content: onlinePlayer });
}

export default { help, data, execute };