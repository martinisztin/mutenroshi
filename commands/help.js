import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { importCommands } from '../import/cmdCollection.js';

const help = {
    name: "help",
    description: "List of commands.",
};

const data = new SlashCommandBuilder()
	.setName(help.name)
	.setDescription(help.description);

async function execute(interaction) {
    const embed = new EmbedBuilder()
    .setTitle("Available commands")
    .setTimestamp()

    embed.addFields(
        (await importCommands(false)).map((command) => {
            return {
                name: '/' + command.data.name,
                value: command.help.description,
                inline: false
            }
        })
    )
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

export default { help, data, execute };