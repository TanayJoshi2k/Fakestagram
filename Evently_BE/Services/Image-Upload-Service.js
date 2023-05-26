const sharp = require("sharp");
const firebaseStorage = require("firebase/storage");
const fireStorage = firebaseStorage.getStorage();

function getFileName(file) {
  const timestamp = Date.now();
  const name = file.originalname.split(".")[0];
  const type = file.originalname.split(".")[1];
  const fileName = `${name}_${timestamp}.webp`;
  return fileName;
}

module.exports = async function ImageUpload(file, username, folder) {

  const fileName = getFileName(file);

  const compressedImgBuffer = await sharp(file.buffer)
    .webp({ quality: 25 })
    .toBuffer();

  const storageRef = firebaseStorage.ref(
    fireStorage,
    `${username}/${folder}/${fileName}`
  );
  const metadata = {
    contentType: file.mimetype,
  };

  const snapshot = await firebaseStorage.uploadBytesResumable(
    storageRef,
    compressedImgBuffer,
    metadata
  );

  const downloadURL = await firebaseStorage.getDownloadURL(snapshot.ref);
  return downloadURL;
};
