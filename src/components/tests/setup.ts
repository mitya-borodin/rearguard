import * as path from "path";
import * as tsNode from "ts-node";
import { TEST_TS_CONFIG_FILE_NAME } from "../../const";

try {
  tsNode.register({
    project: path.resolve(process.cwd(), TEST_TS_CONFIG_FILE_NAME),
    typeCheck: true,
  });
} catch (error) {
  console.error(error.message);

  process.exit(1);
}
