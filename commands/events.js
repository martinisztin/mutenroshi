import { SlashCommandBuilder } from 'discord.js';
import { fetchApi } from '../utils/fetch_api.js';
import { returnRunningEvents } from '../manager/gameEventManager.js';

const help = {
    name: "events",
    description: "Fetches currently running events.",
};

const data = new SlashCommandBuilder()
    .setName(help.name)
    .setDescription(help.description);

async function execute(interaction) {
    await interaction.deferReply();
    
    const response = await fetchApi('https://patch.dboglobal.to:5000/currentEvents');

    const eventNum = parseInt(response.replaceAll('`', ''), 10);

    const eventList = returnRunningEvents(eventNum);

    await interaction.editReply({ content: eventList.length > 0 ? eventList.join('\n') : 'There are no events running at the moment.' });
}

export default { help, data, execute };