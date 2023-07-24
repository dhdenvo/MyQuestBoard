const createData = (res, data, code) => {
  if (!Array.isArray(data)) data = [data];
  res.status(code);
  res.json({ code, size: data.length, data });
};

module.exports = (res, promise) =>
  promise
    .then((data) => createData(res, data, 200))
    .catch((error) => {
      console.error("Error caught", error);
      return createData(res, error == null ? [] : error.toString(), 500);
    });
