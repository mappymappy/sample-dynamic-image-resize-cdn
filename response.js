"use strict";

function createResponse(responseCode) {
  return {
    status: responseCode,
    headers: [{ key: "Content-Type", value: "text/plain" }],
  };
}

function notFound() {
  return createResponse(404);
}

function badRequest() {
  return createResponse(400);
}

function internalError() {
  return createResponse(500);
}

module.exports = {
  badRequest,
  internalError,
  notFound,
};
