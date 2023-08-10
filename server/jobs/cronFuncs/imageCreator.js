const { saveUrl } = require("../../features/image/imageModel");
const { generateAiImage } = require("../../features/shared/helpers/aiHelper");
const alternateModels = require("../../features/shared/helpers/alternateModels");
const { COLLECTION_NAMES } = require("../../global/config.json");

// The list of collections that store an image
const COLLECTIONS = [
  COLLECTION_NAMES.ADVENTURER,
  COLLECTION_NAMES.QUEST,
  COLLECTION_NAMES.BOOK,
].map((collection) =>
  Object.entries(COLLECTION_NAMES).find(([_, val]) => val === collection)
);

const getGenerationText = (collection, doc) => {
  switch (collection) {
    case COLLECTION_NAMES.ADVENTURER:
      return `anime character: ${doc.aiContext}`;
    case COLLECTION_NAMES.QUEST:
      return `anime ${doc.title}: ${doc.description}`;
    case COLLECTION_NAMES.BOOK:
      return `anime ${doc.title}`;
  }
  throw "Invalid collection";
};

module.exports = async () => {
  const allDocs = await Promise.all(
    COLLECTIONS.map(([collection]) =>
      alternateModels[collection].findMany({ hasImage: false })
    )
  );
  const updateProms = COLLECTIONS.map(([collectionKey, collection], i) =>
    allDocs[i].map(async (doc) => {
      const generationText = getGenerationText(collection, doc);
      // Generate an AI image from the generation text for a doc
      const imageUrl = await generateAiImage(generationText);
      // Save the image to the stored data
      await saveUrl(imageUrl, [`${collection}s`, `${doc._id.toString()}.png`]);
      // Update the doc so it doesnt create a new image
      await alternateModels[collectionKey].updateOne(
        { _id: doc._id },
        { hasImage: true }
      );
    })
  ).flat();
  await Promise.all(updateProms);
};
