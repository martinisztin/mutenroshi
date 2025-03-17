import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';

const help = {
    name: "notification",
    description: "Notification settings for the world boss is about to spawn.",
};

const data = new SlashCommandBuilder()
    .setName(help.name)
    .setDescription(help.description)
    .addSubcommand(subcommand => 
        subcommand
            .setName('set')
            .setDescription('Set a channel to send notifications when the world boss is about to spawn.')
            .addChannelOption(option => 
                option.setName('channel')
                .setDescription('Channel to send notifications to.')
                .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand
            .setName('unset')
            .setDescription('Unset the notification channel.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

async function execute(interaction) {
    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
        case 'set':
            const channel = interaction.options.getChannel('channel');
            await setChannel(interaction, channel);
            await interaction.editReply(`Notification channel set to ${channel}.`);
            break;
        case 'unset':
            await unsetChannel(interaction);
            await interaction.editReply(`Notification channel unset.`);
            break;
    }
}

export default { help, data, execute };

async function setChannel(interaction, channel) {
    const notificationRepository = new NotificationRepository();
    try {
        await notificationRepository.update(interaction.guild.id, channel.id, true);
    } catch (error) {
        console.error('Failed to set notification:', error);
    }
}

async function unsetChannel(interaction) {
    const notificationRepository = new NotificationRepository();
    try {
        await notificationRepository.update(interaction.guild.id, null, false);
    } catch (error) {
        console.error('Failed to unset notification:', error);
    }
}