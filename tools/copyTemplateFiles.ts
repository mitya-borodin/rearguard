#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const copy = require("recursive-copy");

const options = {
  overwrite: true,
  dot: true,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  filter: function(arg: string) {
    return arg.indexOf(".ts") === -1 || arg.indexOf("d.ts") !== -1;
  },
};

// TODO Add logging;
copy("src/templates", "lib/src/templates", options)
  .on(copy.events.COPY_FILE_START, (copyOperation: any) => {
    console.info("Copying file " + copyOperation.src + "...");
  })
  .on(copy.events.COPY_FILE_COMPLETE, function(copyOperation: any) {
    console.info("Copied to " + copyOperation.dest);
  })
  .on(copy.events.ERROR, function(error: any, copyOperation: any) {
    console.error("Unable to copy " + copyOperation.dest);
  })
  .then(function(results: any) {
    console.info(results.length + " file(s) copied");
  })
  .catch(function(error: any) {
    return console.error("Copy failed: " + error);
  });
