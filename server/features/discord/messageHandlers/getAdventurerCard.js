const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { getPath } = require("../../image/imageModel");
const { COLLECTION_NAMES } = require("../../../global/config.json");
const { generateSingleResponse } = require("../../shared/helpers/aiHelper");

module.exports = async (adv) => {
  // Generate a custom description & list of skills
  const description = await generateSingleResponse(
    `${adv.name} the ${adv.rank} rank adventurer, "${adv.aiContext}". Generate a 2 sentence description of them. `
  );
  const skills = await generateSingleResponse(
    `List 3 skills a "${adv.aiContext}" adventurer would have. Keep the skills 3 words or less`
  );

  // Get the path of the adventurer's profile picture and attach it to the message
  const advProfilePath = getPath([
    `${COLLECTION_NAMES.ADVENTURER}s`,
    `${adv._id.toString()}.png`,
  ]);
  const advProfile = new AttachmentBuilder(advProfilePath);

  const fields = [
    { name: "Skills:", value: skills, inline: true },
    { name: "Rank:", value: adv.rank, inline: true },
    { name: "Experience:", value: adv.rankPoints.toString(), inline: true },
  ];

  let title = adv.name;
  // Add a palm tree emoji when the adventurer is on vacation
  if (adv.isOnVacation) title += " :palm_tree:";

  // Create the embed for the message
  const embed = new EmbedBuilder()
    .setColor(0xffd500)
    .setTitle(title)
    .setDescription(description)
    .addFields(...fields)
    .setThumbnail(`attachment://${advProfilePath.split("\\").pop()}`);

  return { embeds: [embed], files: [advProfile] };
};
