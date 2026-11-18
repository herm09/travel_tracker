// Messages envoyés chaque lundi. Un message est tiré au hasard à chaque fois
// pour que ça ne fasse pas trop robot. {roles} est remplacé par les mentions.

const weeklyMessages = [
  `☕ Hello {roles} ! Nouvelle semaine, nouvelles quêtes 🗺️
Petit point du lundi : **qu'est-ce que vous avez fait la semaine dernière sur QuestLog ?**
Une feature, un bug corrigé, une PR, une galère... tout compte ! Et si vous êtes bloqués sur un truc, dites-le, on s'entraide 🙌`,

  `🌞 Bon lundi {roles} !
On fait le récap tranquille : **vous avez avancé sur quoi la semaine dernière ?**
Même un petit truc, ça compte. Et dites-nous aussi ce que vous comptez attaquer cette semaine 👀`,

  `🧭 Yo {roles}, c'est l'heure du check-in hebdo !
➡️ Ce que vous avez fait la semaine dernière
➡️ Ce sur quoi vous bossez cette semaine
➡️ Si quelque chose vous bloque
Pas besoin d'un roman, 2-3 lignes ça suffit 😌`,

  `🎮 Quête du lundi débloquée pour {roles} :
**"Raconte ta semaine"** — récompense : +10 XP de motivation ✨
Qu'est-ce que vous avez fait sur le projet la semaine dernière ? Des blocages ?`,

  `🥐 Coucou {roles} ! On espère que le week-end a été chill.
Avant d'attaquer la semaine : **qu'est-ce que vous avez avancé sur QuestLog la semaine dernière ?**
Front, back, design, doc... balancez tout en dessous 👇`,
];

function pickRandomWeeklyMessage(roleMentions) {
  const randomIndex = Math.floor(Math.random() * weeklyMessages.length);
  return weeklyMessages[randomIndex].replace('{roles}', roleMentions);
}

module.exports = { pickRandomWeeklyMessage };
