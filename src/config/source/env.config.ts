import { IEnv } from '../../interfaces/IConfigs';

export default (): IEnv => ({
  isDevelopment: process.env.NODE_ENV === 'development',
  isDebug: process.env.REARGUARD_DEBUG === 'true',
  isVerbose: process.env.REARGUARD_VERBOSE === 'true',
  isAnalyze: process.env.REARGUARD_ANALYZE === 'true',
  isIsomorphic: process.env.REARGUARD_ISOMORPHIC === 'true',
  isInferno: process.env.REARGUARD_INFERNO_JS === 'true',
  isReact: process.env.REARGUARD_REACT === 'true',
  isTS: process.env.REARGUARD_TYPE_SCRIPT === 'true',
  onlyServer: process.env.REARGUARD_ONLY_SERVER === 'true',
  nodeModulePath: process.env.REARGUARD_NODE_MODULE_PATH || '',
})
