import copy from "recursive-copy";

export const copyNonCodeFiles = async (from = "src", to = "dist/src"): Promise<void> => {
  const options = {
    overwrite: true,
    dot: true,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    filter: function (arg: string) {
      return (
        arg.indexOf(".ts") === -1 &&
        arg.indexOf("d.ts") === -1 &&
        arg.indexOf(".tsx") === -1 &&
        arg.indexOf(".jsx") === -1 &&
        arg.indexOf(".js") === -1
      );
    },
  };

  await copy(from, to, options)
    .on(copy.events.COPY_FILE_START, (copyOperation: any) => {
      console.info("Copying file " + copyOperation.src + "...");
    })
    .on(copy.events.COPY_FILE_COMPLETE, function (copyOperation: any) {
      console.info("Copied to " + copyOperation.dest);
    })
    .on(copy.events.ERROR, function (error: any, copyOperation: any) {
      console.error("Unable to copy " + copyOperation.dest);
    })
    .then((results: any) => {
      console.info(results.length + " file(s) copied");
    })
    .catch((error: any) => {
      return console.error("Copy failed: " + error);
    });

  console.log("");
};
