require('dotenv').config();

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const cron = require('node-cron');
const { pickRandomWeeklyMessage } = require('./messages');

// ---------- Configuration ----------
const config = {
  botToken: process.env.DISCORD_TOKEN,
  guildId: process.env.GUILD_ID,
  channelId: process.env.CHANNEL_ID,
  // Noms des rôles à ping (séparés par des virgules)
  roleNames: (process.env.ROLE_NAMES || 'Dev back,Dev front')
    .split(',')
    .map((roleName) => roleName.trim())
    .filter(Boolean),
  // Lundi 9h00 par défaut
  cronSchedule: process.env.CRON_SCHEDULE || '0 9 * * 1',
  timezone: process.env.TIMEZONE || 'Europe/Paris',
  // Crée un fil de discussion sous le message pour garder le salon propre
  createThread: (process.env.CREATE_THREAD || 'true').toLowerCase() === 'true',
};

const missingVariables = ['DISCORD_TOKEN', 'GUILD_ID', 'CHANNEL_ID'].filter(
  (variableName) => !process.env[variableName],
);
if (missingVariables.length > 0) {
  console.error(`❌ Variables manquantes dans .env : ${missingVariables.join(', ')}`);
  process.exit(1);
}

const sendImmediately = process.argv.includes('--now');

// ---------- Bot ----------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function findRolesToMention(guild) {
  const allRoles = await guild.roles.fetch();
  const foundRoles = [];

  for (const wantedRoleName of config.roleNames) {
    const matchingRole = allRoles.find(
      (role) => role.name.toLowerCase() === wantedRoleName.toLowerCase(),
    );
    if (matchingRole) {
      foundRoles.push(matchingRole);
    } else {
      console.warn(`⚠️ Rôle introuvable sur le serveur : "${wantedRoleName}"`);
    }
  }
  return foundRoles;
}

function buildThreadName() {
  const lastMonday = new Date();
  lastMonday.setDate(lastMonday.getDate() - 7);
  const formattedDate = lastMonday.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: config.timezone,
  });
  return `Récap semaine du ${formattedDate}`;
}

async function sendWeeklyCheckIn() {
  try {
    const guild = await client.guilds.fetch(config.guildId);
    const channel = await guild.channels.fetch(config.channelId);

    if (!channel || !channel.isTextBased()) {
      console.error('❌ CHANNEL_ID ne correspond pas à un salon textuel.');
      return;
    }

    const rolesToMention = await findRolesToMention(guild);
    if (rolesToMention.length === 0) {
      console.error('❌ Aucun rôle trouvé, message non envoyé.');
      return;
    }

    const roleMentions = rolesToMention.map((role) => `<@&${role.id}>`).join(' ');
    const sentMessage = await channel.send({
      content: pickRandomWeeklyMessage(roleMentions),
      // Autorise explicitement le ping de ces rôles (et seulement eux)
      allowedMentions: { roles: rolesToMention.map((role) => role.id) },
    });

    if (config.createThread && channel.type === ChannelType.GuildText) {
      try {
        await sentMessage.startThread({
          name: buildThreadName(),
          autoArchiveDuration: 10080, // 7 jours
        });
      } catch (threadError) {
        console.warn(`⚠️ Fil non créé (permission manquante ?) : ${threadError.message}`);
      }
    }

    console.log(`✅ Message du lundi envoyé dans #${channel.name}`);
  } catch (sendError) {
    console.error('❌ Erreur pendant l\'envoi du message :', sendError);
  }
}

client.once('ready', async () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);

  if (sendImmediately) {
    await sendWeeklyCheckIn();
    client.destroy();
    return;
  }

  cron.schedule(config.cronSchedule, sendWeeklyCheckIn, { timezone: config.timezone });
  console.log(`⏰ Planifié : "${config.cronSchedule}" (${config.timezone})`);
});

client.login(config.botToken).catch((loginError) => {
  console.error('❌ Connexion impossible, vérifie DISCORD_TOKEN :', loginError.message);
  process.exit(1);
});
