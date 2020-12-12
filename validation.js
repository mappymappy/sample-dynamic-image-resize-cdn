"use strict";

const validationSuccess = true;
const validationFailure = false;

const convertOptionFactory = require("./convert_option.js");

const validPath = {
  icon: true,
};

const validWidth = {
  min: 5,
  max: 1280,
};

const validHeight = {
  min: 5,
  max: 1280,
};

function validate(request, query) {
  // width,heightは指定範囲のみを許容する (一旦failSoft)
  if (!isValidWidth(query.width)) {
    return createResult(validationFailure, `${query.width} is not valid width`);
  }
  if (!isValidHeight(query.height)) {
    return createResult(
      validationFailure,
      `${qyery.height} is not valid height`
    );
  }

  return createResult(validationSuccess, "");
}

function isValidWidth(width) {
  return width <= validWidth.max && width >= validWidth.min;
}

function isValidHeight(height) {
  return height <= validHeight.max && height >= validHeight.min;
}

function createResult(result, errorMessage) {
  return {
    success: result,
    message: errorMessage,
  };
}

module.exports = {
  validate,
};
