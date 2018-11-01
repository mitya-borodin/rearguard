import { Entry, EntryFunc } from "webpack";
import { entry, isBuild, isDevelopment, isLib, resolveNodeModules, socket } from "./target.config";

export default (entries: string[] = []): string | string[] | Entry | EntryFunc => {
  if (isDevelopment && !isBuild && !isLib) {
    return [
      `${resolveNodeModules("webpack-dev-server")}/client?https://${socket.host}:${socket.port}`,
      `${resolveNodeModules("webpack")}/hot/only-dev-server`,
      ...entries,
      entry,
    ];
  }

  return [...entries, entry];
};
