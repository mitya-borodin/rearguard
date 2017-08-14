import * as fs from 'fs';
import * as path from 'path';

export default (fileName: string, fieldName: string): { exist: boolean, value: any } => {
  const configPath = path.resolve(process.cwd(), fileName);
  
  if (fs.existsSync(configPath)) {
    return {
      exist: true,
      value: {
        [fieldName]: require(configPath)[fieldName]
      }
    };
  }
  
  return {
    exist: false,
    value: {}
  };
}
