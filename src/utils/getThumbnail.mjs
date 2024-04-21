import sharp from "sharp";
import tmp from "tmp";
import fs from "fs/promises";

const getThumbnail = async (url) => {
	// download the thumbnail
	try {
		// fetch the file as buffer
		const response = await fetch(url, {
			responseType: "arraybuffer",
		});

		const buffer = await response.arrayBuffer();

		// convert it to png
		const image = await sharp(buffer).png();

		// open the tmp file
		// const tmpFile = await tmp.file({
		// 	postfix: ".png",
		// });

		// write to the file
		// gen a random filename
		const fileName = `/tmp/${Math.random() * 100000}.png`;
		await fs.writeFile(fileName, image);

		return fileName;
	} catch (error) {
		console.log(error);
	}
};

export default getThumbnail;
