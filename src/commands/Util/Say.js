const { Command, RegisterBehavior, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { MessageEmbed } = require("discord.js");

class Say extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'say',
            aliases: ['echo', 's'],
            description: 'say funny stuff',
            flags: ["embed", "e"],
            options: ["color", "c"],
            preconditions: ["ownerOnly"],
            runIn: CommandOptionsRunTypeEnum.GuildText,
            chatInputCommand: {
                /* register: true, */
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                idHints: ["975829264601604116"],
                guildIds: ["975124858298040451"],
            },
        });
    }

    async messageRun(message, args) {
        return await this.commandLogic(message, args, "messageRun")
    }

    async chatInputRun(interaction, args) {
        return await this.commandLogic(interaction, args, "chatInputRun")
    }

    async commandLogic(message, args, method) {
        const embedFlags = args.getFlags("embed", "e")
        const colorOptions = args.getOptions("color", "c");
        let text;
        try {
            text = await args.rest("string")
        } catch (error) {
            return await message.channel.send({ content: "You need to provide some text to say!" })
        }

        this.handleContent(text, [embedFlags, "embed"], [colorOptions, "color"], message, method)
    }

    async handleContent(input, [flags], [options, optionType], message, method) {
        let content = {};

        if (!flags && !options) {
            content = { content: input }

            if (method == "messageRun") return await message.channel.send(content)
            if (method == "chatInputRun") return await message.reply(content)
        }

        if (flags[1] == "embed" || "e") {
            let color = "RANDOM";
            if (options && (optionType == "color" || "c")) color = options[0]
            const embed = new MessageEmbed()
                .setDescription(input)
                .setColor(color)

            content = { embeds: [embed] }

            if (method == "messageRun") return await message.channel.send(content)
            if (method == "chatInputRun") return await message.reply(content)
        }
    }
}

module.exports = { Say };