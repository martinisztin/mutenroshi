import { SlashCommandBuilder } from 'discord.js';
import { fetchApi } from '../utils/fetch_api.js';

const help = {
    name: "boss",
    description: "Fetches world boss progress.",
};

const data = new SlashCommandBuilder()
    .setName(help.name)
    .setDescription(help.description);

async function execute(interaction) {
    await interaction.deferReply();
    let worldBossProgress = await fetchApi('https://patch.dboglobal.to:5000/bossProgress', 'The World Boss is at', '%');
    await interaction.editReply({ content: worldBossProgress });
}

export default { help, data, execute };