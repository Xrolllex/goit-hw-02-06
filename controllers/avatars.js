const { promises: fs } = require('fs');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const { User } = require('../models/schema.js');

const dirname = path.join(__dirname, '..'); 
const avatarsFolder = path.join(dirname, 'public', 'avatars');
const tmpFolder = path.join(dirname, 'tmp');


fs.mkdir(avatarsFolder, { recursive: true }).catch(console.error);
fs.mkdir(tmpFolder, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpFolder),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${req.user.id}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });


const processAvatar = async (tempPath, userId) => {
  const image = await Jimp.read(tempPath);
  await image.resize(250, Jimp.AUTO).quality(60); 
  const avatarName = `${userId}-${Date.now()}.jpg`;
  const avatarPath = path.join(avatarsFolder, avatarName);
  await image.writeAsync(avatarPath);
  return avatarName;
};

const avatars = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No avatar file provided' });
  }
  const tempPath = req.file.path;
  try {
   
    const avatarName = await processAvatar(tempPath, req.user.id);
    const avatarURL = `${req.protocol}://${req.get('host')}/avatars/${avatarName}`;

    await User.findByIdAndUpdate(req.user.id, { avatarURL });

    await fs.unlink(tempPath);

    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempPath).catch(console.error);
    res.status(500).json({ message: 'Could not process avatar.' });
  }
};

module.exports = { upload, avatars };
