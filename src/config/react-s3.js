const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  dirName: "photos",
  region: process.env.REACT_APP_S3_BUCKET_REGION,
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY
};

export default config;