const model = require("./imageModel");
const { existsSync } = require("fs");
const { DEFAULT_IMAGE_FILE } = require("./imageConfig.json");

const getImage = ({ params }, res) => {
  const { folder, filename } = params;
  let path = model.getPath([folder, filename]);
  // If the file doesn't exist, use the default image
  if (!existsSync(path)) path = model.getPath([folder, DEFAULT_IMAGE_FILE]);
  res.sendFile(path);
};

const saveUrl = async ({ body }, res) => {
  const { url, path } = body;
  await model.saveUrl(url, path);
  res.status(200).send();
};

module.exports = {
  getImage,
  saveUrl,
};
