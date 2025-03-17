import { Events, ActivityType } from 'discord.js';
import { fetchApi, fetchApiRaw } from '../utils/fetch_api.js';
import { deployCommands } from '../deploy.js';
import { NotificationRepository } from '../repository/NotificationRepository.js';
import { returnRunningEvents } from '../manager/gameEventManager.js';

const SCRAMBLE_EVENT_NAME = 'Dragon Ball Scramble';

let scrambleRunning = false;
let eventNotified = false;

export const name = Events.ClientReady;
export const once = true;
export async function execute(client) {
    const notificationRepository = new NotificationRepository();
    
    client.guilds.cache.forEach(async guild => {
        await deployCommands(guild.id);
        // await notificationRepository.create(guild.id);
    });

    setInterval(async () => {
        notificationRepository.getAll().then(async (notifications) => {
            notifications.forEach(async (notification) => {
                if (notification.enabled && notification.notification_channel_id !== null) {
                    await checkBoss(client, notification.notification_channel_id);

                    await checkScramble(client, notification.notification_channel_id);
                }
            });
        });

        await getRichPresenceStatus(client);

    }, 60000);
    
    console.log(`Ready! Logged in as ${client.user.tag}`);
}

async function checkBoss(client, channelId) {
    if (eventNotified) {
        return;
    }

    try {
        const response = await fetchApiRaw('https://patch.dboglobal.to:5000/bossProgress');
        
        const currentPercent = parseFloat(parseFloat(response).toFixed(2));

        if (currentPercent > 99.00 && currentPercent < 99.99) {
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                await channel.send(`World Boss percentage is over 99.0%! Get ready!`);
                eventNotified = true;
            }
        }
        else if (eventNotified) {
            eventNotified = false;
        }
    } catch (error) {
        console.error('Error checking API:', error);
    }
}

async function getRichPresenceStatus(client) {
    const playerCount = await fetchApiRaw('https://patch.dboglobal.to:5000/playersOnline');
    const worldBoss = await fetchApiRaw('https://patch.dboglobal.to:5000/bossProgress');

    let status = [
        `There are ${playerCount} players online.`,
        `The World Boss is currently at ${worldBoss}%.`,
        `I was created by _martiin`,
        `Use /help for a list of commands.`
    ];

    const random = status[Math.floor(Math.random() * status.length)];
    client.user.setActivity(random, { type: ActivityType.Playing});
}

async function checkScramble(client, channelId) {
    const response = await fetchApiRaw('https://patch.dboglobal.to:5000/currentEvents');

    const eventNum = parseInt(response);

    const channel = client.channels.cache.get(channelId);
    if (channel) {
        if (returnRunningEvents(eventNum).find(event => event === SCRAMBLE_EVENT_NAME) !== undefined) {
            if (!scrambleRunning) {
                await channel.send(`${SCRAMBLE_EVENT_NAME} started!`);
                scrambleRunning = true;
            }
        } else if (scrambleRunning) {
            await channel.send(`${SCRAMBLE_EVENT_NAME} ended!`);
            scrambleRunning = false;
        }
    }
}