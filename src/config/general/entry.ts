import { entry, isDevelopment, isIsomorphic, serverEntry, socket } from '../target.config';

export const frontEntry = (entries = []): string[] | string | { [key: string]: string } => {
  if (isDevelopment) {
    return [
      ...isIsomorphic ? [
        'webpack-hot-middleware/client',
      ] : [
        // http://gaearon.github.io/react-hot-loader/getstarted/
        `webpack-dev-server/client?${socket}`,
        'webpack/hot/dev-server',
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
