const Jimp = require("jimp");

const jimpConvert = (pathToTheFile) => {
  Jimp.read(pathToTheFile, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).quality(60).write(pathToTheFile);
  });
};

module.exports = jimpConvert;