import * as fs from "fs";
import * as path from "path";

export default (fileName: string, fieldName: string): { exist: boolean, value: any } => {
  const configPath = path.resolve(process.cwd(), fileName);

  if (fs.existsSync(configPath)) {
    const config: any = JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));

    return {
      exist: true,
      value: {
        [fieldName]: config[fieldName],
      },
    };
  }

  return {
    exist: false,
    value: {},
  };
};
