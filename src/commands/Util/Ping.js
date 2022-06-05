const { Command, RegisterBehavior, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
let easterEgg;

class Ping extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'Ping',
            aliases: ["pong"],
            description: 'Calculates the round trip and bot to api latency.',
            preconditions: ["ownerOnly"],
            runIn: CommandOptionsRunTypeEnum.GuildText,
            chatInputCommand: {
                /* register: true, */
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                idHints: ["975530698859495485"],
                guildIds: ["975124858298040451"]
            }
        });
    }

    // Run the normal message command
    async messageRun(message) {
        return await this.runLogic(message, "messageRun");
    }
    // Run the slash command
    async chatInputRun(interaction) {
        return await this.runLogic(interaction, "chatInputRun");
    }

    // Logic where we split the command into two and serve the user based on what method they called (.ping or /ping)
    async runLogic(message, method) {
        // Method specific logic
        if (method == "messageRun") {
            if (message.content.match(/(ping)/gmi)) easterEgg = "Pong"
            if (message.content.match(/(pong)/gmi)) easterEgg = "Ping"

            const msg = await message.channel.send({ content: "Doing funny stuff..." }).catch(() => { });

            await msg.edit(this.getPing(message, msg)).catch(() => { });
        }
        else if (method == "chatInputRun") {
            if (message.commandName.match(/(ping)/gmi)) easterEgg = "Pong"
            if (message.commandName.match(/(pong)/gmi)) easterEgg = "Ping"

            const msg = await message.reply({ content: "Doing funny stuff...", fetchReply: true }).catch(() => { });

            return await message.editReply(this.getPing(message, msg)).catch(() => { });
        }
    }

    // Calculate ping and return formatted response
    getPing(message, msg) {
        let clientPing = Math.round(client.ws.ping);
        let rtPing = msg.createdTimestamp - message.createdTimestamp
        let content = `🏓 ${easterEgg}!\n\n**Bot to API:** ${clientPing}ms\n**Message Round Trip:** ${rtPing}ms`

        return content;
    }

}

module.exports = { Ping };