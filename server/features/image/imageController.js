const model = require("./imageModel");

const getImage = ({ params }, res) => {
  const { folder, filename } = params;
  res.sendFile(model.getPath([folder, filename]));
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
