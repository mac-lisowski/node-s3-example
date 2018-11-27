/**
 * Example implementation of Amazon Simple Storage Service (Amazon S3)
 *
 * @author Maciej Lisowski
 * @since 2018-11-27
 */

// import dotenv
require("dotenv").config();
const S3 = require("./lib/aws-s3");

S3.upload("./files/test.txt", "example-text-file.txt")
  .then(r => {
    console.log(r);
  })
  .catch(e => {
    console.error(e);
  });

var resize = true;

if (!resize) {
  S3.upload("./files/derek-thomson-443919-unsplash.jpg", "example-image.jpg")
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      console.error(e);
    });
} else {
  S3.upload("./files/derek-thomson-443919-unsplash.jpg", "example-image.jpg", {
    resize: { width: 300, height: 400 }
  })
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      console.error(e);
    });
}
