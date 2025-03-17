import { Events, EmbedBuilder } from 'discord.js';
import { deployCommands } from '../deploy.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';

const embed = new EmbedBuilder()
    .setTitle("Hello!")
    .setDescription(`
        I am Muten Roshi! I provide publicly available information of the DBOG Revelations server.\n\nPlease use \`/help\` to see a list of commands.
        `)
    .setTimestamp()
    .setColor('Blue')
    .setThumbnail('https://media.discordapp.net/attachments/597848713922084895/1324354865475883159/master-roshi-budokai-tenkaichi2.png?ex=6777d915&is=67768795&hm=e6b19aa0eeff1d825c9d93b9ee5d339f8c849899005176e8bafc00c87af69fb1&=&format=webp&quality=lossless&width=676&height=676')



export const name = Events.GuildCreate;

export async function execute(guild) {
    console.log(`Joined a new guild: ${guild.name}`);
    await deployCommands(guild.id);

    const notificationRepository = new NotificationRepository();
    await notificationRepository.create(guild.id);

    const firstChannel = guild.channels.cache.find(channel => 
        channel.type === 0 && channel.permissionsFor(guild.members.me).has('SendMessages')
    );
    if (firstChannel) {
        try {
            await firstChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Failed to send welcome message in ${guild.name}:`, error);
        }
    }
}