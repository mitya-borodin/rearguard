import { Entry, EntryFunc } from "webpack";
import { entry, isBuild, isDevelopment, resolveNodeModules, socket } from "../target.config";

export default (entries: string[] = [], dll: boolean = false): string | string[] | Entry | EntryFunc => {
  if (isDevelopment && !isBuild) {
    /*    if (dll) {
     return {
     vendor: Object.keys(pkg.dependencies),
     };
     } else {
     return [
     `${resolveNodeModules("webpack-dev-server")}/client?http://${socket.host}:${socket.port}`,
     `${resolveNodeModules("webpack")}/hot/dev-server`,
     ...entries,
     entry,
     ];
     }*/
    return [
      `${resolveNodeModules("webpack-dev-server")}/client?http://${socket.host}:${socket.port}`,
      `${resolveNodeModules("webpack")}/hot/dev-server`,
      ...entries,
      entry,
    ];
  }

  /*  if (dll) {
   return {
   vendor: Object.keys(pkg.dependencies),
   };
   }*/

  return [...entries, entry];
};
