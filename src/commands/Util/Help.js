const { MessageEmbed } = require("discord.js");
const { Command } = require('@sapphire/framework');
const { PASTEL_GREEN } = require("../../util/shared/colors.json")
const { capitalize } = require("../../util/shared/functions.js")

class Help extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'Help',
            customFieldTest: "works yes ))___ ----",
            fullCategory: true,
            description: 'Shows additional information about commands.',
        });
    }

    // Checking if the user wants to search for a command, if not, list all commands
    async chatInputRun(interaction) {
        const str = await interaction.options.getString("search");

        if (str) return await this.search(interaction, str);

        return await this.list(interaction);
    }

    // Method called when listing all commands
    async list(interaction) {
        /* let categories = this.container.stores.get("commands").categories;
        let commands = this.container.stores.get("commands"); */
        let TEMPORARY_CATEGORY = this.container.stores.get("commands").categories[0];
        const commandsEmbed = new MessageEmbed()
            .setTitle(`${client.user.username} | Commands`)
            .setDescription(`View all commands and their categories below\nFor further info about a specific command, use /help search <command>`)
            .addField(TEMPORARY_CATEGORY, `\`\`\`\n${this.container.stores.get("commands").map(c => c.name).join(", ")}\n\`\`\``)
            .setColor(PASTEL_GREEN)

        // will work on this later

        /* for (let i = 0; i < categories.length; i++) {
            commandsEmbed.addField(categories[i], `\`\`\`\n${categories.filter(c => c.categories === categories[i]).map(c => c.name).join(", ")}\n\`\`\``)
        } */

        /* for (const category of categories) {
            if (category === '') { continue } else if (category) {
                commandsEmbed.addField(`${category} [${category.size}]`, `${commands.map((cmd) => `${cmd.fullCategory.toLowerCase() == 'nsfw' ? `|| ${cmd.name} ||` : cmd.name}`).join(', ')}`);
            }
        } */

        return await interaction.reply({ embeds: [commandsEmbed], ephemeral: true })
    }

    // Method called when the user wants to inspect a command
    async search(interaction, args) {
        // Trying to find the command from args
        const command = this.container.stores.get("commands").get(args);

        const successEmbed = new MessageEmbed()
            .setTitle(`Search Result | ${command.name}`)
            .setDescription(`Current prefix is: \`${process.env.PREFIX}\`\n\n**Name:** ${command.name}\n**Description:** \`${command.description}\``)
            .setColor(PASTEL_GREEN)

        return await interaction.reply({ embeds: [successEmbed], ephemeral: true })
    }

    // Instead of using the convenient built in method to register commands, we can use the following:
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            // Setting up the command
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption(option => {
                    option
                        .setName("search")
                        .setDescription("Get information about a command.")
                    // Get all command names and put them in an array
                    let commandChoices = [];
                    this.container.stores.get("commands").forEach(c => {
                        commandChoices.push({ name: capitalize(c.name), value: c.name })
                    });
                    // Get every object from commandChoices array and add the choice to option
                    for (let i = 0; i < commandChoices.length; i++) {
                        option.addChoices(commandChoices[i])
                    }
                    // Returning option because I was told so :shrug:
                    return option;
                })
        }, // Again, instead of using the built in method we gotta do it manually :*)
            {
                behaviorWhenNotIdentical: "OVERWRITE",
                idHints: ["983105540207022220"],
                guildIds: ["975124858298040451"]
            }
        )
    }

}

module.exports = { Help };