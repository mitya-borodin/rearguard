import { entry, entryServer, isDevelopment, socket } from '../../prepare.build-tools.config';

export const spaEntry = (entries = []) => {
  if (isDevelopment) {
    return [
      // http://gaearon.github.io/react-hot-loader/getstarted/
      `webpack-dev-server/client?${socket}`,
      'webpack/hot/dev-server',
      ...entries,
      entry,
    ];
  }

  return entry;
};

export const isomorphicEntry = (entries = []) => {
  if (isDevelopment) {
    return [
      'webpack-hot-middleware/client',
      ...entries,
      entry,
    ];
  }

  return entry;
};

export const serverEntry = (entries = []) => {
  return [
    ...entries,
    entryServer,
  ];
};
