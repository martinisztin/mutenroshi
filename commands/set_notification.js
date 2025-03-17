import { SlashCommandBuilder } from 'discord.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';

const help = {
    name: "set_notification",
    description: "Set a channel to send notifications when the world boss is about to spawn.",
};

const data = new SlashCommandBuilder()
		.setName(help.name)
		.setDescription(help.description)
        .addChannelOption(option => option.setName('channel').setDescription('Channel to send notifications to.'));

async function execute(interaction) {
    const notificationRepository = new NotificationRepository();

    await interaction.deferReply();

    const channel = interaction.options.getChannel('channel');
    try {
        await notificationRepository.update(interaction.guild.id, channel.id, true);
    } catch (error) {
        console.error('Failed to set notification:', error);
    }

    await interaction.editReply(`Notification channel set to ${channel}.`);
}

export default { help, data, execute };