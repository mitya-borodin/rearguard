#!/usr/bin/env node
const copy = require("recursive-copy");

const options = {
  overwrite: true,
  dot: true,
  filter: function(arg) {
    return arg.indexOf(".ts") === -1 || arg.indexOf("d.ts") !== -1;
  },
};

// TODO Add logging;
copy("src/templates", "lib/src/templates", options)
  .on(copy.events.COPY_FILE_START, function(copyOperation) {
    console.info("Copying file " + copyOperation.src + "...");
  })
  .on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
    console.info("Copied to " + copyOperation.dest);
  })
  .on(copy.events.ERROR, function(error, copyOperation) {
    console.error("Unable to copy " + copyOperation.dest);
  })
  .then(function(results) {
    console.info(results.length + " file(s) copied");
  })
  .catch(function(error) {
    return console.error("Copy failed: " + error);
  });