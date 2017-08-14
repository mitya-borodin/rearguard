import sourceConfig from './source';

export default () => {
  return JSON.stringify(sourceConfig(), null, 2);
}
