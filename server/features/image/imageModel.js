const { createWriteStream } = require("fs");
const { dirname, resolve } = require("path");
const axios = require("axios");
const { STORED_IMAGE_LOC } = require("./imageConfig.json");
const { ENV_TYPES } = require("../../global/config.json");

const getDevPath = () => [dirname(require.main.filename), STORED_IMAGE_LOC];

const getProdPath = () => [STORED_IMAGE_LOC];

const getPath = (pathArr) => {
  const storagePath =
    process.env.NODE_ENV === ENV_TYPES.PROD ? getProdPath() : getDevPath();
  return resolve(...storagePath.concat(pathArr));
};

const saveUrl = async (imageUrl, pathArr) => {
  const accuratePath = getPath(pathArr);
  const writer = createWriteStream(accuratePath);

  const response = await axios.get(imageUrl, { responseType: "stream" });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

module.exports = {
  getPath,
  saveUrl,
};
