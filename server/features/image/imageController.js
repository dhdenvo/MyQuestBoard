const model = require("./imageModel");
const { STORED_IMAGE_LOC } = require("./imageConfig.json");
const { dirname } = require("path");

const getImage = ({ params }, res) => {
  const { folder, filename } = params;
  const mainPath = dirname(require.main.filename);
  const imagePath = `${mainPath}/${STORED_IMAGE_LOC}/${folder}/${filename}`;
  res.sendFile(imagePath);
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
