const { createWriteStream } = require("fs");
const path = require("path");
const axios = require("axios");

const saveUrl = async (imageUrl, pathArr) => {
  const mainFolder = path.dirname(require.main.filename);
  const accuratePath = path.resolve(mainFolder, ...pathArr);
  const writer = createWriteStream(accuratePath);

  const response = await axios.get(imageUrl, { responseType: "stream" });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

module.exports = {
  saveUrl,
};
