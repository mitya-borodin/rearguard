import { Entry, EntryFunc } from "webpack";
import { entry, isBuild, isDevelopment, resolveNodeModules, socket } from "../target.config";

export default (entries = []): string | string[] | Entry | EntryFunc => {
  if (isDevelopment && !isBuild) {
    return [
      `${resolveNodeModules("webpack-dev-server")}/client?${socket}`,
      `${resolveNodeModules("webpack")}/hot/dev-server`,
      ...entries,
      entry,
    ];
  }

  return entry;
};
