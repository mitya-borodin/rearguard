import { entry, entryServer, isDevelopment, isIsomorphic, socket } from '../../prepare.build-tools.config';

export const clientEntry = (entries = []) => {
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

export const serverEntry = (entries = []) => [
  ...entries,
  entryServer,
];
