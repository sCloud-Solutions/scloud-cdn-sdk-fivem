"use strict";
(() => {
  // src/client/index.ts
  var requestCounter = 0;
  function __takeScreenshot(options, cb) {
    requestCounter++;
    const currentId = requestCounter;
    const path = options.path || "";
    const rpcOptions = {
      bucket: options.bucket,
      name: options.name
    };
    const timeout = setTimeout(() => {
      console.log(`^3[sCloud SDK]^0 Request ${currentId} timed out.`);
      removeEventListener("scloud:takeScreenshotResponse", eventHandler);
      if (cb)
        cb(null);
    }, 15e3);
    const eventHandler = (id, response) => {
      if (id !== currentId)
        return;
      clearTimeout(timeout);
      removeEventListener("scloud:takeScreenshotResponse", eventHandler);
      if (response.success && response.url) {
        if (cb)
          cb({ url: response.url });
      } else {
        console.log(`^1[sCloud SDK]^0 Request ${id} failed: ${response.error}`);
        if (cb)
          cb(null);
      }
    };
    onNet("scloud:takeScreenshotResponse", eventHandler);
    emitNet("scloud:takeScreenshot", currentId, path, rpcOptions);
  }
  exports("__takeScreenshot", __takeScreenshot);
})();
