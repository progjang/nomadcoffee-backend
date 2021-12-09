import { createWriteStream } from "fs";
import { uploadPhoto } from "./common.aws";

export const processCategory = (categories) => {
    const slug = categories
      .match(/[^\s,]+/g)
      ?.join('-')
      .toLowerCase()

    const listCategory = categories.split(",").map(item => item.trim());
    return listCategory.map(category => ({
        where: { name: category },
        create: { name: category, slug },
    }));  
};

export const handlePhoto = async(obj, id) =>  {

  let urlList = [];
  if(obj instanceof Array){
    obj.map(async(photo) => {
      const {filename, createReadStream} = await photo;
      const newFilename = `${id}-${Date.now()}-${filename}`;
      const readStream = createReadStream();
      const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
      readStream.pipe(writeStream);
      urlList.push(`http://localhost:3000/static/${newFilename}`);
    });
    return urlList;

  } else {
    const {filename, createReadStream} = await obj;
    const newFilename = `${id}-${Date.now()}-${filename}`;
    console.log(newFilename);
    const readStream = createReadStream();
    const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
    readStream.pipe(writeStream);
    return `http://localhost:3000/static/${newFilename}`;
  }

}

export const handlePhotoS3 = async(obj, id) =>  {
  let urlList = [];
  let photoUrl = "";
  if(obj instanceof Array){
    obj.map(async(photo) => {
      photoUrl = await uploadPhoto(photo, id);
      urlList.push(photoUrl);
    });
  } else {
    photoUrl = await uploadPhoto(obj, id);
    urlList.push(photoUrl);
  }
  console.log(urlList);
  return urlList;
}