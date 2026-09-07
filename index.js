const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const greetings = [
  "merhaba",
  "selam",
  "salam",
  "salut",
  "hey",
  "السلام عليكم",
  "gamarjoba",
  "გამარჯობა",
  "buna ziua",
  "bună ziua"
];

const commands = [
  new SlashCommandBuilder()
    .setName("interact")
    .setDescription("Interact with another user")
    .addStringOption(option =>
      option
        .setName("action")
        .setDescription("What do you want to do?")
        .setRequired(true)
        .addChoices(
          { name: "slap", value: "slaps" },
          { name: "hug", value: "hugs" },
          { name: "highfive", value: "high-fives" },
          { name: "pat", value: "pats" },
          { name: "bonk", value: "bonks" }
        )
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Who do you want to interact with?")
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands("1545901945057845330", "1538863607474028554")
      { body: commands }
    );

    console.log("Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
})();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "interact") {
    const action = interaction.options.getString("action");
    const user = interaction.options.getUser("user");

    await interaction.reply(
      `${interaction.user} ${action} ${user} 👋🐱`
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content.toLowerCase().trim();

  const startsWithGreeting = greetings.some(greeting =>
    text === greeting || text.startsWith(greeting + " ")
  );

  if (startsWithGreeting) {
    await message.react("👋");
  }
});

client.once("ready", () => {
  console.log(`The Meowl Bot is online as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
