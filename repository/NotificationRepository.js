import { DB } from '../utils/db.js';

export class NotificationRepository {
    constructor() {
        this.db = DB.getInstance();
    }
    
    async create(discordServerId, notificationChannelId = null, enabled = false) {
        const query = `
            INSERT INTO boss_notifications (discord_server_id, notification_channel_id, enabled)
            VALUES (?, ?, ?)
        `;
        try {
            const result = await this.db.query(query, [discordServerId, notificationChannelId, enabled]);
            return result.lastID;
        } catch (error) {
            console.error('Failed to create boss notification:', error);
        }

        return undefined;
    }

    async getAll() {
        const query = `
            SELECT *
            FROM boss_notifications;
        `;
        return await this.db.query(query);
    }

    async getByServerId(discordServerId) {
        const query = `
            SELECT *
            FROM boss_notifications
            WHERE discord_server_id = ?
        `;
        return await this.db.query(query, [discordServerId]);
    }

    async update(serverId, notificationChannelId, enabled) {
        const query = `
            UPDATE boss_notifications 
            SET notification_channel_id = ?, enabled = ?
            WHERE discord_server_id = ?
        `;
        return await this.db.query(query, [notificationChannelId, enabled, serverId]);
    }

    async delete(id) {
        return await this.db.query(query, [id]);
    }

    async toggleEnabled(id) {
        const query = `
            UPDATE boss_notifications 
            SET enabled = NOT enabled 
            WHERE id = ?
        `;
        return await this.db.query(query, [id]);
    }

    async isEnabled(id) {
        const query = `
            SELECT enabled
            FROM boss_notifications
            WHERE id = ?
        `;
        return await this.db.query(query, [id]);
    }
}

export default new NotificationRepository();