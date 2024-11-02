const alternateModels = require("../../features/shared/helpers/alternateModels");
const { sendMessage } = require("../../features/discord/discordModel");
const {
  generateSingleResponse,
} = require("../../features/shared/helpers/aiHelper");

const sendCongrats = async (
  { name, newRank, rank, aiContext, discordId },
  rankSystem
) => {
  // Determine if the adventurer has been promoted or demoted
  const newRankInd = Object.keys(rankSystem).indexOf(newRank);
  const oldRankInd = Object.keys(rankSystem).indexOf(rank);
  const genAlters =
    newRankInd < oldRankInd
      ? ["congratulate", "promotion", " and very exciting"]
      : ["apologize to", "demotion", ""];

  const generationMessage =
    `Generate a message to ${genAlters[0]} adventurer "${name}" on their ${genAlters[1]} ` +
    `to their new adventurer rank ${newRank} from their previous rank ${rank}. ` +
    `Make the message approximately 2 sentences${genAlters[2]}.`;
  const message = await generateSingleResponse(generationMessage, aiContext);

  // Send discord message of quest to complete
  return await sendMessage({ discordId }, message);
};

module.exports = async () => {
  const adventurers = await alternateModels.ADVENTURER.findMany({});
  const ranks = await alternateModels.RANK.findMany({}).lean();
  const rankSystem = Object.fromEntries(
    ranks.map(({ rank, ...details }) => [rank, details])
  );

  const rankUpdates = adventurers
    .map((adventurer) => {
      const { rank, rankPoints } = adventurer;
      // Get the rank the adventurer should be at (based on promotions)
      const newRank = Object.entries(rankSystem).find(
        ([_, { promotion }]) => rankPoints >= promotion || !promotion
      )[0];
      // See if the player should be changed from current rank
      const shouldChange = !(
        rankPoints > rankSystem[rank].demotion &&
        rankPoints < rankSystem[rank].promotion
      );
      if (newRank !== rank && shouldChange)
        return { newRank, ...adventurer.toObject() };
    })
    .filter((update) => update);

  // If there are no rank updates, dont do anything
  if (!rankUpdates.length) return;

  // Update all the adventurers to their new ranks
  const updates = rankUpdates.map(({ _id, newRank }) => ({
    updateOne: { filter: { _id }, update: { $set: { rank: newRank } } },
  }));
  await alternateModels.ADVENTURER.bulkWrite(updates);

  // Send discord messages to all adventurers that have ranked up
  await Promise.all(
    rankUpdates.map((update) => sendCongrats(update, rankSystem))
  );
};
