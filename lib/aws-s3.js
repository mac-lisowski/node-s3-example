const fs = require("fs");
const AWS = require("aws-sdk");
const Sharp = require("sharp");

/**
 * AWSS3 Example of simple class with basic functionality used to upload
 * files to Amaozn S3 bucket
 *
 * @author Maciej Lisowski
 * @since 2018-11-27
 */
class AWSS3 {
  constructor() {
    // Amazon SES configuration
    this.config = {
      // current version of Amazon S3 API (see: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
      apiVersion: "2006-03-01",
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION
    };

    this.s3 = new AWS.S3(this.config);
  }

  /**
   * S3Upload method used to upload file from given location into Amazon S3 Bucket
   * If you are uploading an image you can sepcify param resize and create 
   * ne thumbnail to be uploaded to S3 bucket
   * 
   * @author Maciej Lisowski
   * @since 2018-11-27
   * @param {String} filepath
   * @param {String} name
   * @param {JSON} options eg. { resize: { width: 300, height: 400 } }
   * @return
   */
  upload(filepath, name, options) {
    return new Promise((resolve, reject) => {
      // check if file exist
      if (fs.existsSync(filepath)) {
        let res = {
          filepath: filepath,
          data: []
        };
        // upload file
        let fileBinaryString = fs.readFileSync(filepath, null);
        let params = {
          Body: fileBinaryString,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: name
        };

        this.s3.putObject(params, (e, d) => {
          if (e) {
            reject(e);
          }

          d.name = name;
          res.data.push(d);

          // check if we should create resized copy of uploaded file
          if (
            typeof options !== "undefined" &&
            typeof options.resize !== "undefined" &&
            typeof options.resize.width === "number" &&
            typeof options.resize.height === "number"
          ) {
            let width = options.resize.width;
            let height = options.resize.height;

            // resize image and upload to S3
            // won't be creating any temporary files
            Sharp(filepath)
              .resize(width, height)
              .toBuffer()
              .then(buffer => {
                params.Body = buffer;

                params.Key = width + "-" + height + "-" + params.Key;

                this.s3.putObject(params, (e, d) => {
                  if (e) {
                    reject(e);
                  }

                  d.name = params.Key;

                  res.data.push(d);
                  resolve(res);
                });
              })
              .catch(e => reject(e));
          } else {
            resolve(res);
          }
        });
      } else {
        reject("File " + filepath + " does not exist");
      }
    });
  }
}
module.exports = new AWSS3();
