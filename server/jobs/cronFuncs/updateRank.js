const alternateModels = require("../../features/shared/helpers/alternateModels");
const { sendMessage } = require("../../features/discord/discordModel");
const {
  generateSingleResponse,
} = require("../../features/shared/helpers/aiHelper");

const rankSystem = {
  S: { promotion: 20000, demotion: 20000 },
  A: { promotion: 15000, demotion: 15000 },
  B: { promotion: 11000, demotion: 10900 },
  C: { promotion: 8000, demotion: 7900 },
  D: { promotion: 5000, demotion: 4800 },
  E: { promotion: 2500, demotion: 2000 },
  F: { promotion: 1000, demotion: 500 },
  G: {},
};

module.exports = async () => {
  const adventurers = await alternateModels.ADVENTURER.findMany({});
  const rankUpdates = adventurers
    .map(({ _id, name, rank, rankPoints }) => {
      // Get the rank the adventurer should be at (based on promotions)
      const newRank = Object.entries(rankSystem).find(
        ({ promotion }) => rankPoints > promotion || !promotion
      );
      // See if the player should be demoted from current rank
      const shouldDemote = rankPoints < rankSystem[rank].demotion;
      if (newRank === rank && !shouldDemote) return;
      return { _id, name, newRank, prevRank };
    })
    .filter((update) => update);

  // If there are no rank updates, dont do anything
  if (!rankUpdates.length) return;

  // Update all the adventurers to their new ranks
  const updates = rankUpdates.map(({ _id, newRank }) => ({
    updateOne: { query: { _id }, update: { $set: { rank: newRank } } },
  }));
  await alternateModels.ADVENTURER.bulkWrite(updates);
};
