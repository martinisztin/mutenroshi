export const events = [
    '',
    'Dragon Ball Scramble',
    'Dojo War',
    'Kid Solo Budokai',
    'Kid Team Budokai',
    'Adult Solo Budokai',
    'Adult Team Budokai',
    '2x XP',
    '2x Ranked Arena Mudosa Rewards',
    '2x Token',
    '2x Dragon Ball Drop Rate',
    '2x Wagu Drop Rate/Sell Rate',
    '2x Upgrade Kit Drop Rate',
    '2x Crafting Disassemble Rewards',
    'Fairy Event',
    '2x Box Drop Rate',
    'Honeybee Event',
    'April Fools Event',
    'Bunny Event',
    'Summer Event',
    'Halloween Event',
    'Christmas Event',
];
export function returnRunningEvents(data) {
    let runningEvents = [];

    for (let i = 0; i < events.length; i++) {
        if (data & Math.pow(2, i)) {
            runningEvents.push(events[i]);
        }
    }

    return runningEvents;
}