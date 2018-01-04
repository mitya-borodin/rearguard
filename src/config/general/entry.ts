import { Entry, EntryFunc } from "webpack";
import { entry, isBuild, isDevelopment, resolveNodeModules, socket } from "../target.config";

export default (entries: string[] = []): string | string[] | Entry | EntryFunc => {
  if (isDevelopment && !isBuild) {

    return [
      `${resolveNodeModules("webpack-dev-server")}/client?https://${socket.host}:${socket.port}`,
      `${resolveNodeModules("webpack")}/hot/dev-server`,
      ...entries,
      entry,
    ];
  }

  return [...entries, entry];
};
