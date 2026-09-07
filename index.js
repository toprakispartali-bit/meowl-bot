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

const gifs = {
  slaps: [
    "https://klipy.com/gifs/cat-kitty-6UD",
    "https://klipy.com/gifs/orange-cat-slap"
  ],

  kicks: [
    "https://klipy.com/gifs/take-that-cat",
    "https://klipy.com/gifs/cat-sent-flying"
  ],

  dances: [
    "https://klipy.com/gifs/cat-showercap-slyonicz"
  ],

  waves: [
    "https://klipy.com/gifs/cat-meme-wave-emoji",
    "https://klipy.com/gifs/hello-friend-waving-hand"
  ],

  bonks: [
    "https://klipy.com/gifs/cat-head-bonk-cat-loaf-slap",
    "https://klipy.com/gifs/cat-hammer-cat-being-hit-on-the-head-with-a-hammer"
  ],

  pats: [
    "https://klipy.com/gifs/cat-cat-pet",
    "https://klipy.com/gifs/pat-cat-gyB"
  ],

  hugs: [
    "https://klipy.com/gifs/cat-love-LNG",
    "https://klipy.com/gifs/cat-cats-155"
  ],

  "high-fives": [
    "https://klipy.com/gifs/cat-cat-high-five",
    "https://klipy.com/gifs/high-five-cat-five"
  ]
};

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
  { name: "bonk", value: "bonks" },
  { name: "wave", value: "waves" },
  { name: "dance", value: "dances" },
  { name: "kick", value: "kicks" }
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
      Routes.applicationGuildCommands("1545901945057845330", "1538863607474028554"),
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

    const actionGifs = gifs[action];
    const randomGif =
      actionGifs[Math.floor(Math.random() * actionGifs.length)];

    await interaction.reply(
      `${interaction.user} ${action} ${user} 👋🐱\n${randomGif}`
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
