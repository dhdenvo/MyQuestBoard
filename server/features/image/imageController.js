const model = require("./imageModel");

const getImage = ({ params }, res) => {
  const { imagePath } = params;
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
