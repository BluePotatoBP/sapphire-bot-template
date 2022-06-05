const { SubCommandPluginCommand } = require("@sapphire/plugin-subcommands");
const { MessageEmbed } = require("discord.js");
const { RegisterBehavior } = require('@sapphire/framework');
const { send } = require("@sapphire/plugin-editable-commands");

class Help extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'Help',
            aliases: ['hlep'],
            fullCategory: true,
            description: 'Help command, very cool',
            subCommands: ['search', { input: 'show', default: true }],
            /* chatInputCommand: {
                //register: true,
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                idHints: ["982804294367584268"],
                guildIds: ["975124858298040451"],
            }, */
        });
    }

    async search(message, args) {
        const command = this.container.stores.get("commands").get(await args.rest("string"));

        if (!command) return await message.channel.send("Command not found.")

        const embed = new MessageEmbed()
            .setTitle(`Search Result | ${command.name}`)
            .setDescription(`Current prefix is: \`${process.env.PREFIX}\`\n\n**Name:** ${command.name}\n**Description:** \`${command.description}\`\n**Aliases:** \`${command.aliases.join(", ")}\``)
            .setColor("RANDOM")

        return await send(message, { embeds: [embed] })
    }

    async show(message, args) {
        let category = this.container.stores.get("commands").categories[0];
        const embed = new MessageEmbed()
            .setTitle("Commands List")
            .addField(category, `\`\`\`\n${this.container.stores.get("commands").map(c => c.name).join(", ")}\n\`\`\``)
            .setColor("RANDOM")

        return await send(message, { embeds: [embed] })
    }
}

module.exports = { Help };