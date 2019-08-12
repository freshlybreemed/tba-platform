// Are we in NOW.SH?
const isNow = process.env.NOW_REGION

module.exports = {
  bucket_name: isNow ? process.env.BUCKET_NAME : 'MYBUCKET',
  access_key: isNow ? process.env.ACCESS_KEY_ID : 'ACCESSKEY',
  secret_key: isNow ? process.env.SECRET_ACCESS_KEY : 'SECRETKEY',
  region: isNow ? process.env.region : 'us-east-1',
  port: process.env.PORT || 8000,
  secret: process.env.SECRET || "whatever your secret is",
  db: process.env.DB || "mongodb://localhost/class-demo"
  }

