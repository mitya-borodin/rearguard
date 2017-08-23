import { entry, isDevelopment, isIsomorphic, resolveNodeModules, serverEntry, socket } from "../target.config";

export const frontEntry = (entries = []): string[] | string | { [key: string]: string } => {
  if (isDevelopment) {
    return [
      ...isIsomorphic ? [
        `${resolveNodeModules("webpack-hot-middleware")}/client`,
      ] : [
        // http://gaearon.github.io/react-hot-loader/getstarted/
        `${resolveNodeModules("webpack-dev-server")}/client?${socket}`,
        `${resolveNodeModules("webpack")}/hot/dev-server`,
      ],
      ...entries,
      entry,
    ];
  }

  return entry;
};

export const backEntry = (entries = []): string[] | string | { [key: string]: string } => [
  ...entries,
  serverEntry,
];
