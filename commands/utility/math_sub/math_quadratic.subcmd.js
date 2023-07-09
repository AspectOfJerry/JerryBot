const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {logger, permissionCheck, sleep, jMath, jEmojis, cleanNumber} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    // await interaction.deferReply();
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const a = cleanNumber(String(interaction.options.getNumber("a")));
    logger.append("info", "PARAM", `'/math quadratic' > a: ${a}`);
    const b = cleanNumber(String(interaction.options.getNumber("b")));
    logger.append("info", "PARAM", `'/math quadratic' > b: ${b}`);
    const c = cleanNumber(String(interaction.options.getNumber("c")));
    logger.append("info", "PARAM", `'/math quadratic' > c: ${c}`);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Quadratic equation")
                .setEmoji("📚") // books
                .setURL("https://en.wikipedia.org/wiki/Quadratic_equation"),
            new MessageButton()
                .setStyle("LINK")
                .setLabel("MathSolver")
                .setEmoji("🧮") // abacus
                .setURL(generateMathSolverLink(a, b, c))
        );

    // Checks

    // Main
    const solutions = jMath.solveQuadratic(a, b, c);
    logger.append("info", "STDOUT", `'/math quadratic' > solutions = [${solutions.toString()}]`);

    let color = "GREEN";
    let title = "Math solve quadratic";
    let explanation = "The equation represents a quadratic curve, which is a curve with the highest power of the variable being 2."
        + "\n> Quadratic curves can take various shapes, such as parabolas, and the solutions to this equation provide the x-values where the curve intersects the x-axis."
        + `\n\n${jEmojis.success_emoji} Equation is quadratic!`
        + "\n\n** **";
    let isQuad = true;

    if(a === 0 && b !== 0) {
        isQuad = false;
        color = "RED";
        title = "IllegalArgumentException";
        explanation = "The coefficient of x^2 (a) in a quadratic equation must be non-zero. This is because the coefficient determines the shape of the curve that represents the equation."
            + "\n> A non-zero coefficient ensures that the equation represents a quadratic curve rather than a linear equation. If the coefficient of x^2 is zero (a = 0) and the coefficient of x is non-zero (b ≠ 0), the equation becomes linear instead of quadratic."
            + `\n\n${jEmojis.fail_emoji} Equation is no longer quadratic!`
            + "\n\n** **";

        row.components[1].setLabel("MathSolver (Linear)");

        logger.append("notice", "STDOUT", "'/math quadratic' > The coefficient of x^2 (a) cannot be zero (0) because it determines the shape of the curve, which represents the equation.");
    } else if(solutions.some(Number.isNaN)) {
        isQuad = false;
        color = "YELLOW";
        explanation = "*Imaginary roots are currently not supported by the command.* Could not find any real roots for the equation because the discriminant is negative."
            + "\n> In a quadratic equation, the discriminant determines whether the equation has real solutions."
            + " A negative discriminant indicates that the equation does not intersect the x-axis, resulting in the absence of real roots."
            + `\n\n${jEmojis.warn_emoji} Equation possibly contains imaginary roots!`
            + "\n\n** **";

        logger.append("notice", "STDOUT", "'/math quadratic' > Could not find any real roots for the equation because the discriminant is negative.");
    } else if(solutions.includes(undefined) || solutions.includes(null)) {
        isQuad = false;
        color = "FUSCIA";
        explanation = "Could not find a solution to this equation. It appears the forces of mathematics encountered an enigmatic twist, rendering the equation inscrutable to mere mortal calculations. The solution remains elusive, concealed within the mysteries of the universe."
            + "\nPlease contact the bot administrators if you believe that this is an error."
            + "\n\n** **";
        logger.append("ERROR", "STDOUT", "'/math quadratic' > Could not find a solution to this equation.");
    }


    const answer = new MessageEmbed()
        .setColor(color)
        .setTitle(`${title}`)
        .setDescription(`${explanation}`)
        .addFields(
            {name: "Coefficient of x^2", value: `**>** ${a}`, inline: true},
            {name: "Coefficient of x", value: `**>** ${b}`, inline: true},
            {name: "Constant term", value: `**>** ${c}`, inline: true},
            {name: "Solutions", value: `${solutions.join(", ").replace(/,/g, ",\n")}`, inline: false}
        )
        .setImage(isQuad ? "https://wikimedia.org/api/rest_v1/media/math/render/png/00c22777378f9c594c71158fea8946f2495f2a28"
            : "https://wikimedia.org/api/rest_v1/media/math/render/png/d40196d521aae8b791055b7da8f8844357969a1f");

    interaction.reply({embeds: [answer], components: [row]});
};

function generateMathSolverLink(a, b, c) {
    const equation = `${a} { x }^{ 2 } ${b > 0 ? "+" : "-"} ${Math.abs(b)}x ${c > 0 ? "+" : "-"} ${Math.abs(c)} = 0`;
    return `https://mathsolver.microsoft.com/en/solve-problem/${encodeURIComponent(equation)}`;
}
