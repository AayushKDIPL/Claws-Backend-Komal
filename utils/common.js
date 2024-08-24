import fs from "fs"

export const removeImage = (url, img) => {
    try {
      fs.unlinkSync(url + img);
    } catch (error) {
      console.log(error);
    }
  };
  