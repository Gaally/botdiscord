const Discord = require("discord.js");
const config = require("./config.json");
const giveMeAJoke = require("discord-jokes");

const client = new Discord.Client();
client.on("ready", () => {
  console.log(`Bot Online`);
  client.user.setActivity("HelloKitty Online");
  client.guilds.cache.forEach((guild) => {
    //for each guild the bot is in
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
      if (channel.type == "text" && defaultChannel == "") {
        if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
          defaultChannel = channel;
        }
      }
    });
    setInterval(function () {
      defaultChannel.send(`@everyone trop mignon !!`); //send it to whatever channel the bot has permissions to send on
    }, 120000);
  });
});

const prefix = "!";

client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  } else if (command === "sum") {
    const numArgs = args.map((x) => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => (counter += x));
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }
});
client.on("message", (message) => {
  if (message.content.toLowerCase().includes("chaton")) {
    message.reply("I <3 Cats !!!");
  }
});

client.on("guildMemberAdd", (member) => {
  let guildChannel = client.channels.cache.get("765142287855517700");
  if (!guildChannel) {
    return;
  }
  if (guildChannel.type != "text") {
    return;
  }
  guildChannel
    .send(`Bienvenue sur mon serveur Discord ${member.user} !`)
    .catch(console.error);
});

client.on("message", (message) => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!kick"
  if (message.content.startsWith("!kick")) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member
          .kick("Optional reason that will display in the audit logs")
          .then(() => {
            // We let the message author know we were able to kick the person
            message.reply(`CHEH ${user.tag}`);
          })
          .catch((err) => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply("I was unable to kick the member");
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("That user isn't in this guild!");
      }
      // Otherwise, if no user was mentioned
    } else {
      message.reply("You didn't mention the user to kick !");
    }
  }
});

client.on("message", (message) => {
  if (message.content.toLowerCase().includes("blague")) {
    giveMeAJoke.getRandomDadJoke(function (joke) {
      message.channel.send(joke);
    });
  }
});

client.login(config.BOT_TOKEN);
