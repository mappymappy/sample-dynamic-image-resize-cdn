"use strict";

function createByQueryString(query) {
  // 受け取ったqueryから変換などが必要な場合はここに書く
  let width = query.width;
  let height = query.height;

  return {
    width: parseInt(width, 10),
    height: parseInt(height, 10),
  };
}

module.exports = {
  createByQueryString,
};
