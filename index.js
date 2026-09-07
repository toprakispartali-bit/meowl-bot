const { Client, GatewayIntentBits } = require("discord.js");

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
