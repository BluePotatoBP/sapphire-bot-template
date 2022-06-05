require("dotenv").config();
require('@sapphire/plugin-editable-commands/register');
const { SapphireClient, BucketScope, LogLevel } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');

const client = new SapphireClient({
    intents: ['GUILDS', "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_INTEGRATIONS"],
    defaultPrefix: process.env.PREFIX,
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    loadMessageCommandListeners: true,
    defaultCooldown: {
        delay: Time.Second * 10,
        limit: 2,
        filteredUsers: process.env.OWNERS.split(","),
        scope: BucketScope.User
    },
    logger: { level: LogLevel.Info },
    allowedMentions: { repliedUser: true },
});

client.login();

global.client = client;