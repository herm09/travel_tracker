# QuestLog Standup Bot 🤖

Chaque lundi à 9h (heure de Paris), le bot poste un petit message sympa dans un salon Discord, ping **@Dev back** et **@Dev front**, et demande ce que chacun a fait sur le projet la semaine dernière. Il ouvre aussi un fil « Récap semaine du … » pour que les réponses restent rangées.

## 1. Créer le bot sur Discord

1. Va sur https://discord.com/developers/applications → **New Application** (ex. « QuestLog Bot »).
2. Onglet **Bot** → **Reset Token** → copie le token (garde-le secret !).
3. Onglet **OAuth2 → URL Generator** :
   - Scopes : `bot`
   - Permissions : `View Channels`, `Send Messages`, `Create Public Threads`, `Send Messages in Threads`, `Mention @everyone, @here, and All Roles`
4. Ouvre l'URL générée et invite le bot sur ton serveur.

> ⚠️ Pour que le ping marche, soit le bot a la permission **Mention All Roles**, soit les rôles « Dev back » / « Dev front » sont réglés sur **« Autoriser tout le monde à @mentionner ce rôle »** (Paramètres du serveur → Rôles).

## 2. Récupérer les IDs

Paramètres Discord → Avancés → active le **Mode développeur**. Ensuite :
- clic droit sur le serveur → **Copier l'identifiant du serveur** → `GUILD_ID`
- clic droit sur le salon → **Copier l'identifiant du salon** → `CHANNEL_ID`

## 3. Lancer en local

```bash
npm install
cp .env.example .env   # puis remplis le fichier
npm run test-message   # envoie le message tout de suite pour tester
npm start              # lance le bot, qui attendra lundi 9h
```

## 4. L'héberger (il doit tourner 24/7)

Le bot doit rester allumé pour envoyer le message le lundi. Options :
- **Render** (déjà utilisé sur le projet) : crée un *Background Worker*, build `npm install`, start `npm start`, et ajoute les variables du `.env` dans « Environment ».
- **Railway**, **Fly.io**, ou un Raspberry Pi / VPS avec `pm2 start src/index.js --name questlog-bot`.

## Personnaliser

- Messages : `src/messages.js` (un message est tiré au hasard chaque semaine).
- Horaire : `CRON_SCHEDULE` dans `.env` (ex. `30 9 * * 1` pour 9h30).
- Rôles : `ROLE_NAMES` (noms exacts, séparés par des virgules).
- Pas de fil : `CREATE_THREAD=false`.
