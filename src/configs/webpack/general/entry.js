import { entry, entryServer, isDevelopment } from '../../prepare.build-tools.config';

export const clientEntry = (entries = []) => {
  if (isDevelopment) {
    return [
      `webpack-hot-middleware/client`,
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
