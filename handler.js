"use strict";

const aws = require("aws-sdk");
const s3 = new aws.S3();
const validation = require("./validation.js");
const responseFactory = require("./response.js");
const convertOptionFactory = require("./convert_option.js");
const sharp = require("sharp");
const querystring = require("querystring");

module.exports.execute = (event, context, callback) => {
  //parseEvent @see https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
  const request = event.Records[0].cf.request;
  // s3のパスから最初の/を取り除く
  const path = decodeURIComponent(request.uri).substr(1);
  const query = querystring.parse(request.querystring);
  // validate
  const validationResult = validation.validate(request, query);
  if (!validationResult.success) {
    return context.succeed(responseFactory.badRequest());
  }
  //parseQuery
  let convertOptions = convertOptionFactory.createByQueryString(query);
  //s3Target
  const s3Params = {
    Bucket: request.origin.s3.domainName.split(".")[0],
    Key: path,
  };
  //fetchFromOrigin~ReturnResponse
  let sharpBody;
  s3.getObject(s3Params)
    .promise()
    .then((result) => {
      sharpBody = sharp(result.Body);
      return sharpBody.metadata();
    })
    .then((metadata) => {
      // 元データ以上の引き伸ばしはしない。(お好みで)
      convertOptions.format = metadata.format;
      convertOptions.width =
        metadata.width < convertOptions.width
          ? metadata.width
          : convertOptions.width;
      convertOptions.height =
        metadata.height < convertOptions.height
          ? metadata.height
          : convertOptions.height;
      // @see https://sharp.pixelplumbing.com/api-resize
      return sharpBody
        .resize(convertOptions.width, convertOptions.height, { fit: "cover" })
        .rotate()
        .toBuffer();
    })
    .then((convertResult) => {
      let body = convertResult.toString("base64");
      const response = {
        status: "200",
        statusDescription: "OK",
        headers: {
          "content-type": [
            {
              key: "Content-Type",
              value: `image/${convertOptions.format}`,
            },
          ],
        },
        body: body,
        bodyEncoding: "base64",
      };
      context.succeed(response);
    })
    .catch((err) => {
      switch (err.code) {
        case "AccessDenied":
          // s3:ListBucketがLambdaに権限としてない場合 s3GetObjectは403を返すので、404として扱う。(お好みで)
          // @see https://aws.amazon.com/jp/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/
          return context.succeed(responseFactory.notFound());
        default:
          // それ以外は特にハンドリングしたいことがないので500+logging
          console.log(err);
          return context.succeed(responseFactory.internalError());
      }
    });
};
