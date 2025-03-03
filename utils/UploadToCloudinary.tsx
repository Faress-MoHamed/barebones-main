import axios from "axios";

export const uploadToCloudinary = async (uri: any) => {
	try {
		// const data: any = new FormData();

		// Correctly append the image file
		// data.append("file", file);

		// data.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset

		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/dzymxdt4a/upload`,
			{
				upload_preset: "ml_default",
				file: uri,
				// uploadpreset: "ml_default",
			}
		);

		// console.log(response.data);
		return response.data.url; // Cloudinary URL
	} catch (error: any) {
		console.error(
			"Cloudinary Upload Error:",
			error.response?.data || error.message
		);
		throw new Error("Failed to upload image.");
	}
};
