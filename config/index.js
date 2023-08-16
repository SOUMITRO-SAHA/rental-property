require("dotenv").config();

exports.config = {
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
	PORT: process.env.PORT || "4000",

	S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
	S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
	S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
	S3_REGION: process.env.S3_REGION,
};
